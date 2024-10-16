const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); 
;

const guardarPerfil = async (req, res) => {
  const { nombre, biografia, correo, intereses, userMail, url_foto_perfil } = req.body;
  const telefono = parseInt(req.body.telefono, 10);

  const pool = req.pool;

  try {
    const queryUsuario = `
      UPDATE usuario
      SET nombre = $2, telefono = $3, url_foto_perfil = $4
      WHERE mail = $1;
    `;
    const valuesUsuario = [userMail, nombre, telefono, url_foto_perfil]; 
    await pool.query(queryUsuario, valuesUsuario);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ message: 'Error al actualizar usuario' });
  }

  try {
    const queryFeriante = `
      INSERT INTO feriante (biografia, user_mail)
      VALUES ($1, $2)
      ON CONFLICT (user_mail) DO UPDATE
      SET biografia = EXCLUDED.biografia;
    `;
    const valuesFeriante = [biografia, userMail];
    await pool.query(queryFeriante, valuesFeriante);
  } catch (error) {
    console.error('Error al actualizar feriante:', error);
    return res.status(500).json({ message: 'Error al actualizar feriante' });
  }

  if (intereses && intereses.length > 0) {
    try {
      await pool.query(`DELETE FROM intereses WHERE user_mail = $1;`, [userMail]);

      const queryIntereses = `
        INSERT INTO intereses (id_interes, interes, user_mail)
        VALUES ($1, $2, $3);
      `;
      for (const interes of intereses) {
        await pool.query(queryIntereses, [1, interes, userMail]);
      }
    } catch (error) {
      console.error('Error al insertar intereses:', error);
      return res.status(500).json({ message: 'Error al insertar intereses' });
    }
  }

  res.status(201).json({ message: 'Perfil guardado correctamente' });
};


const obtenerPerfil = async (req, res) => {
  const { userMail } = req.params;  
  const pool = req.pool;

  try {
    const usuarioResult = await pool.query(`
      SELECT nombre, telefono, mail, url_foto_perfil
      FROM usuario
      WHERE mail = $1;
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
      telefono: usuario.telefono,
      biografia: feriante.biografia || '',
      intereses: intereses,
      correo: usuario.mail,
      url_foto_perfil: fotoPerfilUrl, 
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

const actualizarCorreo = async (req, res) => {
  const { correo, userMail } = req.body; 

  if (!userMail) {
    return res.status(400).json({ message: 'El correo del usuario es requerido' });
  }

  if (!correo) {
    return res.status(400).json({ message: 'El nuevo correo es requerido' });
  }

  try {
    const query = `
      UPDATE feriante
      SET user_mail = $1
      WHERE user_mail = $2;
    `;
    await req.pool.query(query, [correo, userMail]); 

    res.status(200).json({ message: 'Correo actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el correo:', error); 
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const actualizarContraseña = async (req, res) => {
  const { nuevaContraseña, userMail } = req.body; 

  if (!nuevaContraseña) {
    return res.status(400).json({ message: 'Nueva contraseña es requerida' });
  }

  if (!userMail) {
    return res.status(400).json({ message: 'El correo del usuario es requerido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    const query = `
      UPDATE usuario
      SET contrasena = $1
      WHERE mail = $2; /
    `;
    await req.pool.query(query, [hashedPassword, userMail]); 

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error); 
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};



module.exports = { guardarPerfil, obtenerPerfil, guardarFotoPerfil, actualizarCorreo, actualizarContraseña};
