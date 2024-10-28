const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); 
;

const guardarPerfil = async (req, res) => {
  const { nombre, biografia, intereses, userMail, url_foto_perfil } = req.body;
  const telefono = parseInt(req.body.telefono, 10);
  const pool = req.pool;

  try {
    await pool.query('BEGIN');

    const queryUsuario = `
      UPDATE feriante
      SET nombre = $2, telefono = $3, url_foto_perfil = $4
      WHERE user_mail = $1;
    `;
    const valuesUsuario = [userMail, nombre, telefono, url_foto_perfil]; 
    await pool.query(queryUsuario, valuesUsuario);

    const queryFeriante = `
      UPDATE feriante 
      SET biografia = $1
      WHERE user_mail = $2;
    `;
    const valuesFeriante = [biografia, userMail];
    await pool.query(queryFeriante, valuesFeriante);

    if (intereses && intereses.length > 0) {
      await pool.query(`DELETE FROM intereses WHERE user_mail = $1;`, [userMail]);

      const queryIntereses = `
        INSERT INTO intereses (interes, user_mail)
        VALUES ($1, $2);
      `;
      for (const interes of intereses) {
        await pool.query(queryIntereses, [interes, userMail]);
      }
    }

    await pool.query('COMMIT');
    res.status(201).json({ message: 'Perfil guardado correctamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al guardar el perfil:', error);
    res.status(500).json({ message: 'Error al guardar el perfil' });
  }
};


const obtenerPerfil = async (req, res) => {
  const { userMail } = req.params;  
  const pool = req.pool;

  try {
    const usuarioResult = await pool.query(`
      SELECT nombre, apellido, telefono, user_mail, url_foto_perfil
      FROM feriante
      WHERE user_mail = $1;
    `, [userMail]);

    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = usuarioResult.rows[0];

    let feriante = {};
    try {
      const ferianteResult = await pool.query(`
        SELECT biografia
        FROM feriante
        WHERE user_mail = $1;
      `, [userMail]);

      feriante = ferianteResult.rows[0] || {};
    } catch (error) {
      console.error('Error al obtener la biografía del feriante:', error);
    }

    let intereses = [];
    try {
      const interesesResult = await pool.query(`
        SELECT interes
        FROM intereses
        WHERE user_mail = $1;
      `, [userMail]);

      intereses = interesesResult.rows.map(row => row.interes);
    } catch (error) {
      console.error('Error al obtener los intereses:', error);
    }

    const fotoPerfilUrl = usuario.url_foto_perfil
      ? `${req.protocol}://${req.get('host')}${usuario.url_foto_perfil}`
      : ''; 

    res.status(200).json({
      nombre: usuario.nombre,
      apellido: usuario.apellido,  
      telefono: usuario.telefono,
      biografia: feriante.biografia || '',  
      intereses: intereses,
      correo: usuario.user_mail,
      url_foto_perfil: fotoPerfilUrl 
    });
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};


const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


const sanitizeFilename = (email) => {
  return email.replace(/[^a-zA-Z0-9]/g, '_') + '_fotoPerfil.png';
};


const guardarFotoPerfil = async (req, res) => {
  const { foto, userMail } = req.body;
  const filename = sanitizeFilename(userMail);

  const filePath = path.join(uploadDir, filename); 
  try {
    await fs.promises.writeFile(filePath, foto, 'base64');
    res.json({ url_foto: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error al guardar la foto de perfil:', error);
    res.status(500).json({ message: 'Error al guardar la foto.' });
  }
};

const cargarFotoPerfil = (req, res) => {
  const { userMail } = req.params;
  const filename = sanitizeFilename(userMail);
  const filePath = path.join(uploadDir, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath); 
  } else {
    res.status(404).json({ message: 'Foto de perfil no encontrada' });
  }
};

const actualizarCorreo = async (req, res) => {
  const { correo, user_mail } = req.body; 
  const pool = req.pool;

  if (!user_mail || !correo) {
    return res.status(400).json({ message: 'El correo actual y el nuevo correo son requeridos' });
  }

  try {
    await pool.query('BEGIN');

    const queryIntereses = `
      UPDATE intereses
      SET user_mail = $1
      WHERE user_mail = $2;
    `;
    await pool.query(queryIntereses, [correo, user_mail]);

    const queryFeriante = `
      UPDATE feriante
      SET user_mail = $1
      WHERE user_mail = $2;
    `;
    await pool.query(queryFeriante, [correo, user_mail]);

    await pool.query('COMMIT');

    res.status(200).json({ message: 'Correo actualizado correctamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al actualizar el correo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


const actualizarContraseña = async (req, res) => {
  const { nuevaContraseña, user_mail } = req.body;
  const pool = req.pool;

  if (!nuevaContraseña) {
    return res.status(400).json({ message: 'La nueva contraseña es requerida' });
  }

  if (!user_mail) {
    return res.status(400).json({ message: 'El correo del usuario es requerido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    const query = `
      UPDATE feriante
      SET contrasena = $1
      WHERE user_mail = $2;
    `;
    await pool.query(query, [hashedPassword, user_mail]);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// INICIO MODULO POSTULACIONES 


// obtiene todas las vacantes donde feriante sea null -- osea que esten vacias/disponibles
const getVacantesVacias = async (req , res, pool) =>{

  const { } = req.body.vacante;

  try {
    const result = await pool.query(
      `SELECT * from detalle_team_vacante 
      WHERE feriante_mail = null;`
    );

    return res.json(result.rows)
  } catch (error) {
    console.error('Error al ingresar la postulacion:', error);
    throw error;
  }


}

const savePostulacion = async (req , res, pool) =>{

  const { feriante_mail, id_vacante, estado} = req.body.postulacion;

  try {
    const result = await pool.query(
      `INSERT INTO postulaciones (feriante_mail,id_vacante,estado) 
      VALUES (1$,$2,$3)`, [feriante_mail, id_vacante, estado]
    );

    return res.json(result.rowCount > 0)
  } catch (error) {
    console.error('Error al ingresar la postulacion:', error);
    throw error;
  }


}


module.exports = { 
  guardarPerfil, 
  obtenerPerfil,
  guardarFotoPerfil,
  cargarFotoPerfil,
  actualizarCorreo,
  actualizarContraseña,
  getVacantesVacias,   //inicio modulo postulaciones
  savePostulacion
};
