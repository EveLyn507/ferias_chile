const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();




// LOGIN -> BUSCA Y EXTRAE EL USUARIO QUE SE LOGEA
const login_encargado = async (req, res, pool) => {
  const { mail, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM public.encargado_feria WHERE user_mail = $1', [mail]);
    const user = result.rows[0];

    if (!user || contrasena !== user.contrasena) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    const role =  user.id_tipo_usuario;
    const email = user.user_mail
    res.json({ token, role, email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};






// LOGIN -> BUSCA Y EXTRAE EL USUARIO QUE SE LOGEA
const login_feriante = async (req, res, pool) => {
  const { mail, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM public.feriante WHERE user_mail = $1', [mail]);
    const user = result.rows[0];

    if (!user || contrasena !== user.contrasena) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    const role =  user.id_tipo_usuario;
    const email = user.user_mail
    res.json({ token, role, email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};



// LOGIN -> BUSCA Y EXTRAE EL USUARIO QUE SE LOGEA
const login_municipal = async (req, res, pool) => {
  const { mail, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM public.administrador_municipal WHERE user_mail = $1', [mail]);
    const user = result.rows[0];

    if (!user || contrasena !== user.contrasena) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    const role =  user.id_tipo_usuario;
    const email = user.user_mail
    res.json({ token, role, email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};









// REGISTRO USUARIO -> LO REGISTRA EN LA BD
const register = async (req, res, pool) => {
  const { mail , rut ,nombre , apellido , telefono  , role, contrasena} = req.body;
  try {
    await pool.query(`INSERT INTO public.usuario (mail, rut, nombre, apellido, telefono, id_tipo_usuario, contrasena) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [mail, rut, nombre, apellido, telefono, role, contrasena]);
res.status(201).send('Usuario registrado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar usuario');
  }
};


module.exports = { login_encargado,login_feriante,login_municipal, register};
