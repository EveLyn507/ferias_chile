const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();


// Lógica para login
const login = async (req, res, pool) => {
  const { email, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM ferias_chile.public."USUARIO" WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || contrasena !== user.contrasena) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};

// Lógica para registro (ejemplo)
const register = async (req, res, pool) => {
  const { nombre , apellido ,rut , email , telefono , contrasena  } = req.body;
  try {
    await pool.query('INSERT INTO ferias_chile.public."USUARIO" (nombre , apellido ,rut , email , telefono , contrasena) VALUES ($1, $2, $3, $4, $5, $6)', [nombre , apellido ,rut , email , telefono , contrasena ]);
    res.status(201).send('Usuario registrado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar usuario');
  }
};

module.exports = { login, register };
