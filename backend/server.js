const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ferias_chile',
  password: 'contrasena',
  port: 5432, // Puerto predeterminado de PostgreSQL
});

app.use(cors());
app.use(express.json());

// Ruta de login
app.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM ferias_chile.public."USUARIO" WHERE email = $1', [email]);
    const user = result.rows[0];
    

    if (!user) {
      
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar contraseñas en texto plano
    if (contrasena !== user.contrasena) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar token
    const token = jwt.sign({ id: user.email }, 'xd', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
