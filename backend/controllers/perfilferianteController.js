const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const guardarPerfil = async (req, res) => {
  const { nombre, telefono, direccion, biografia, correo, intereses } = req.body;

  try {
    const pool = req.pool; 

    // Insertar el usuario en la tabla 'usuario' si no existe
    const queryUsuario = `
      INSERT INTO usuario (mail, nombre, telefono)
      VALUES ($1, $2, $3)
      ON CONFLICT (mail) DO NOTHING
    `;
    const valuesUsuario = [correo, nombre, telefono];
    await pool.query(queryUsuario, valuesUsuario);

    // Insertar o actualizar datos en la tabla 'feriante'
    const queryFeriante = `
      INSERT INTO feriante (biografia, user_mail)
      VALUES ($1, $2)
      ON CONFLICT (user_mail) DO UPDATE
      SET biografia = EXCLUDED.biografia
    `;
    const valuesFeriante = [biografia, correo];
    await pool.query(queryFeriante, valuesFeriante);

    // Insertar intereses en la tabla 'intereses'
    if (intereses && intereses.length > 0) {
      const queryIntereses = `
        INSERT INTO intereses (interes, id_feriante, user_mail)
        VALUES ($1, (SELECT user_mail FROM feriante WHERE user_mail = $2), $2)
        ON CONFLICT (id_feriante, interes) DO NOTHING
      `;
      for (const interes of intereses) {
        await pool.query(queryIntereses, [interes, correo]);
      }
    }

    res.status(201).json({ message: 'Perfil guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el perfil:', error);
    res.status(500).json({ message: 'Error al guardar el perfil' });
  }
};

module.exports = { guardarPerfil };