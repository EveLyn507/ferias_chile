const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');



const guardarPerfil = async (req, res) => {

  const { nombre, direccion, biografia, correo, intereses } = req.body;
  const telefono = parseInt(req.body.telefono, 10);

  console.log(nombre, telefono, direccion, biografia, correo, intereses )
  
  const pool = req.pool;



  try {
     
    const queryUsuario = `
      UPDATE usuario
      SET nombre = $2, telefono = $3
      WHERE mail = $1;
    `;
    const valuesUsuario = [correo, nombre, telefono];
    await pool.query(queryUsuario, valuesUsuario);

    const queryFeriante = `
      INSERT INTO feriante (biografia, user_mail)
      VALUES ($1, $2)
      ON CONFLICT (user_mail) DO UPDATE
      SET biografia = EXCLUDED.biografia
    `;
    const valuesFeriante = [biografia, correo];
    await pool.query(queryFeriante, valuesFeriante);

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