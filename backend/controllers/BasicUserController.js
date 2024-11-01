const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const pool = require('../server');
const { OAuth2Client } = require('google-auth-library');//npm install google-auth-library


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
    const id_user = user.id_user_enf;
    res.json({ token, role, email ,id_user});
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
    const id_user = user.id_user_fte;
    console.log(id_user)
    res.json({ token, role, email ,id_user});
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
    const id_user = user.id_user_adm;
    res.json({ token, role, email ,id_user});
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
      `INSERT INTO public.feriante (user_mail, rut, rut_div, nombre, apellido, telefono, id_tipo_usuario, contrasena, perfil_privado) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [user_mail, rut, rut_div, nombre, apellido, telefono, role, hashedPassword, false] 
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

// REGISTRO USUARIO GOOGLE
const registerGoogleFeriante = async (req, res) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ message: 'El token de Google no se proporcionó correctamente.' });
  }

  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const user_mail = payload.email;
    const nombre = payload.given_name;
    const apellido = payload.family_name;
    const auth_google = payload.sub;
    const url_foto_perfil = payload.picture;

    // Verificar si el usuario ya está registrado
    const result = await req.pool.query('SELECT * FROM public.feriante WHERE user_mail = $1', [user_mail]);
    const existingUser = result.rows[0];

    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está asociado a una cuenta.' });
    }

    // Crear nueva contraseña para el usuario
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Inserción del nuevo usuario
    try {
      const result = await req.pool.query(
        `INSERT INTO public.feriante (user_mail, id_tipo_usuario, nombre, apellido, rut, rut_div, telefono, url_foto_perfil, auth_google, contrasena, perfil_privado) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_user_fte AS id_user`,
        [user_mail, 2, nombre, apellido, 0, '0', 0, url_foto_perfil, auth_google, hashedPassword, true]
      );

      const id_user = result.rows[0].id_user;
      const token = jwt.sign({ id: id_user }, 'secret_key', { expiresIn: '1h' });
      res.json({ token, role: 2, email: user_mail, id_user });
    } catch (insertError) {
      console.error('Error al insertar el usuario:', insertError);
      res.status(500).json({ message: 'Error al registrar el usuario en la base de datos.' });
    }

  } catch (error) {
    console.error('Error en la verificación del token de Google:', error);
    res.status(400).json({ message: 'El token de Google no es válido.' });
  }
};



module.exports = {
  registerGoogleFeriante,
};



module.exports = { login_encargado,login_feriante,login_municipal, registerEncargado_feria, registerFeriante, registerAdministrador_municipal, registerGoogleFeriante};
