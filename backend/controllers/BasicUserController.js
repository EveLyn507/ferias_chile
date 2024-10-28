const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');


// Cargar variables de entorno
dotenv.config();



// LOGIN -> BUSCA Y EXTRAE EL USUARIO QUE SE LOGEA
const login_encargado = async (req, res, pool) => {
  const { mail, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM public.encargado_feria WHERE user_mail = $1', [mail]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    const role = user.id_tipo_usuario;
    const email = user.user_mail;
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

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    const role = user.id_tipo_usuario;
    const email = user.user_mail;
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

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    const role = user.id_tipo_usuario;
    const email = user.user_mail;
    res.json({ token, role, email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};

// REGISTRO USUARIO -> encargado_feria
const registerEncargado_feria = async (req, res, pool) => {
  const { user_mail, rut, rut_div, nombre, apellido, telefono, role, contrasena } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.query(
      `INSERT INTO public.encargado_feria (user_mail, rut, rut_div, nombre, apellido, telefono, id_tipo_usuario, contrasena) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user_mail, rut, rut_div, nombre, apellido, telefono, role, hashedPassword]
    );

    res.status(201).send('Usuario registrado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar usuario');
  }
};

// REGISTRO USUARIO -> public.feriante
const registerFeriante = async (req, res, pool) => {
  const { user_mail, rut, rut_div, nombre, apellido, telefono, role, contrasena } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.query(
      `INSERT INTO public.feriante (user_mail, rut, rut_div, nombre, apellido, telefono, id_tipo_usuario, contrasena) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user_mail, rut, rut_div, nombre, apellido, telefono, role, hashedPassword]
    );

    res.status(201).send('Usuario registrado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar usuario');
  }
};

// REGISTRO USUARIO -> LO REGISTRA EN LA BD
const registerAdministrador_municipal = async (req, res, pool) => {
  const { user_mail, rut, rut_div, nombre, apellido, telefono, role, contrasena } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await pool.query(
      `INSERT INTO public.administrador_municipal (user_mail, rut, rut_div, nombre, apellido, telefono, id_tipo_usuario, contrasena) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user_mail, rut, rut_div, nombre, apellido, telefono, role, hashedPassword]
    );

    res.status(201).send('Usuario registrado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al registrar usuario');
  }
};

const registerGoogleFeriante = async (req, res) => {
  const { user_mail, nombre, apellido, auth_google, url_foto_perfil } = req.body;

  try {
    // Verificar si el correo ya está registrado
    const result = await pool.query('SELECT * FROM public.feriante WHERE user_mail = $1', [user_mail]);
    const existingUser = result.rows[0];

    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está asociado a una cuenta.' });
    }

    // Crear una contraseña aleatoria ya que no la necesitamos para login con Google
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Insertar un nuevo usuario en la base de datos
    await pool.query(
      `INSERT INTO public.feriante (user_mail, id_tipo_usuario, nombre, apellido, rut, rut_div, telefono, url_foto_perfil, auth_google, contrasena) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [user_mail, 2, nombre, apellido, 0, '0', 0, url_foto_perfil, auth_google, hashedPassword]
    );

    // Generar un token de JWT
    const token = jwt.sign({ id: user_mail }, 'xd', { expiresIn: '1h' });
    res.json({ token, role: 2, email: user_mail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario con Google.' });
  }
};

module.exports = { login_encargado,login_feriante,login_municipal, registerEncargado_feria, registerFeriante, registerAdministrador_municipal, registerGoogleFeriante};
