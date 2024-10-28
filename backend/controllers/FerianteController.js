const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Función para actualizar datos personales
const actualizarDatosPersonales = async (req, res) => {
  const { userMail, nombre, apellido, telefono } = req.body;

  try {
    const telefonoEntero = parseInt(telefono, 10);
    const query = `
      UPDATE feriante
      SET nombre = $1, apellido = $2, telefono = $3
      WHERE user_mail = $4;
    `;
    await req.pool.query(query, [nombre, apellido, telefonoEntero, userMail]);
    res.status(200).json({ message: 'Datos personales actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar los datos personales:', error);
    res.status(500).json({ message: 'Error al actualizar los datos personales' });
  }
};

// Función para cargar datos personales
const cargarDatosPersonales = async (req, res) => {
  const { userMail } = req.params;
  try {
    const query = `
      SELECT nombre, apellido, telefono
      FROM feriante
      WHERE user_mail = $1;
    `;
    const result = await req.pool.query(query, [userMail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al cargar nombre, apellido telefono:', error);
    res.status(500).json({ message: 'Error al cargar nombre, apellido y telefono' });
  }
};

// Función para actualizar biografía
const guardarBiografia = async (req, res) => {
  const { userMail, biografia } = req.body;

  try {
    const query = 'UPDATE feriante SET biografia = $1 WHERE user_mail = $2;';
    await req.pool.query(query, [biografia, userMail]);
    res.status(200).json({ message: 'Biografía actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la biografía:', error);
    res.status(500).json({ message: 'Error al actualizar la biografía' });
  }
};

// Función para cargar biografía
const cargarBiografia = async (req, res) => {
  const { userMail } = req.params;

  try {
    const query = 'SELECT biografia FROM feriante WHERE user_mail = $1;';
    const result = await req.pool.query(query, [userMail]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ biografia: result.rows[0].biografia });
  } catch (error) {
    console.error('Error al obtener la biografía:', error);
    res.status(500).json({ message: 'Error al obtener la biografía' });
  }
};

// Función para limpiar y asegurar el nombre del archivo basado en el correo del usuario
const sanitizeFilename = (email) => {
  return email.replace(/[^a-zA-Z0-9]/g, '_') + '_fotoPerfil.png';
};

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Función para guardar foto de perfil
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

// Función para cargar foto de perfil
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

// Función para actualizar intereses
const actualizarIntereses = async (req, res) => {
  const { userMail, intereses } = req.body;

  try {
    await req.pool.query('BEGIN');
    await req.pool.query('DELETE FROM intereses WHERE user_mail = $1;', [userMail]);

    if (intereses && intereses.length > 0) {
      const queryIntereses = 'INSERT INTO intereses (interes, user_mail) VALUES ($1, $2);';
      for (const interes of intereses) {
        await req.pool.query(queryIntereses, [interes, userMail]);
      }
    }

    await req.pool.query('COMMIT');
    res.status(200).json({ message: 'Intereses actualizados correctamente' });
  } catch (error) {
    await req.pool.query('ROLLBACK');
    console.error('Error al actualizar intereses:', error);
    res.status(500).json({ message: 'Error al actualizar intereses' });
  }
};

// Función para cargar intereses
const cargarIntereses = async (req, res) => {
  const { userMail } = req.params;

  try {
    const query = 'SELECT interes FROM intereses WHERE user_mail = $1;';
    const result = await req.pool.query(query, [userMail]);

    res.status(200).json(result.rows.map(row => row.interes));
  } catch (error) {
    console.error('Error al cargar intereses:', error);
    res.status(500).json({ message: 'Error al cargar intereses' });
  }
};

// Función para actualizar el correo
const actualizarCorreo = async (req, res) => {
  const { nuevoCorreo, user_mail } = req.body;

  try {
    await req.pool.query('BEGIN');

    const updateQueries = [
      'UPDATE feriante SET user_mail = $1 WHERE user_mail = $2;',
      'UPDATE intereses SET user_mail = $1 WHERE user_mail = $2;',
      'UPDATE detalle_supervisor SET feriante_mail = $1 WHERE feriante_mail = $2;' 
    ];

    for (const query of updateQueries) {
      await req.pool.query(query, [nuevoCorreo, user_mail]);
    }

    await req.pool.query('COMMIT');
    res.status(200).json({ message: 'Correo actualizado correctamente' });
  } catch (error) {
    await req.pool.query('ROLLBACK');
    console.error('Error al actualizar el correo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


// Función para actualizar la contraseña
const actualizarContraseña = async (req, res) => {
  const { nuevaContraseña, userMail } = req.body;

  if (!nuevaContraseña) {
    return res.status(400).json({ message: 'La nueva contraseña es requerida' });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    const query = 'UPDATE feriante SET contrasena = $1 WHERE user_mail = $2;';
    await req.pool.query(query, [hashedPassword, userMail]);

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
  actualizarDatosPersonales,
  cargarDatosPersonales,
  guardarBiografia,
  cargarBiografia,
  guardarFotoPerfil,
  cargarFotoPerfil,
  actualizarIntereses,
  cargarIntereses,
  actualizarCorreo,
  actualizarContraseña,
  getVacantesVacias,   //inicio modulo postulaciones
  savePostulacion
};
