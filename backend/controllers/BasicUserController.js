const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const pool = require('../server');
const { OAuth2Client } = require('google-auth-library');//npm install google-auth-library
const nodemailer = require('nodemailer'); // npm install nodemailer

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
      const existingUser = await pool.query('SELECT * FROM public.encargado_feria WHERE user_mail = $1', [user_mail]);
      if (existingUser.rows.length > 0) {
          return res.status(409).json({ message: 'Correo ya registrado' });
      }
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      await pool.query(
          `INSERT INTO public.encargado_feria (user_mail, rut, rut_div, nombre, apellido, telefono, id_tipo_usuario, contrasena) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [user_mail, rut, rut_div, nombre, apellido, telefono, role, hashedPassword]
      );
      res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// REGISTRO USUARIO -> public.feriante
const registerFeriante = async (req, res, pool) => {
  const { user_mail, rut, rut_div, nombre, apellido, telefono, role, contrasena } = req.body;
  try {
      const existingUser = await pool.query('SELECT * FROM public.feriante WHERE user_mail = $1', [user_mail]);
      if (existingUser.rows.length > 0) {
          return res.status(409).json({ message: 'Correo ya registrado' });
      }
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      await pool.query(
          `INSERT INTO public.feriante (user_mail, rut, rut_div, nombre, apellido, telefono, id_tipo_usuario, contrasena, perfil_privado) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [user_mail, rut, rut_div, nombre, apellido, telefono, role, hashedPassword, false]
      );
      res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

// REGISTRO USUARIO -> LO REGISTRA EN LA BD
const registerAdministrador_municipal = async (req, res, pool) => {
  const { user_mail, rut, rut_div, nombre, apellido, telefono, role, contrasena } = req.body;
  try {
      const existingUser = await pool.query('SELECT * FROM public.administrador_municipal WHERE user_mail = $1', [user_mail]);
      if (existingUser.rows.length > 0) {
          return res.status(409).json({ message: 'Correo ya registrado' });
      }
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      await pool.query(
          `INSERT INTO public.administrador_municipal (user_mail, rut, rut_div, nombre, apellido, telefono, id_tipo_usuario, contrasena) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [user_mail, rut, rut_div, nombre, apellido, telefono, role, hashedPassword]
      );
      res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar usuario' });
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

const recuperarContrasena = async (req, res, pool) => {
  const { email } = req.body;

  try {
    // Verificar si el correo existe en alguna de las tablas de usuarios
    const userQueries = [
      'SELECT user_mail FROM public.encargado_feria WHERE user_mail = $1',
      'SELECT user_mail FROM public.feriante WHERE user_mail = $1',
      'SELECT user_mail FROM public.administrador_municipal WHERE user_mail = $1'
    ];

    let userFound = false;
    for (const query of userQueries) {
      const result = await pool.query(query, [email]);
      if (result.rows.length > 0) {
        userFound = true;
        break;
      }
    }

    if (!userFound) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    // Generar un token JWT para recuperación con expiración de 1 hora
    const token = jwt.sign({ email }, 'secret_key', { expiresIn: '1h' });
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Configuración del servicio de correo
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'manasesvergara10@gmail.com',
        pass: 'zicq enmm rtyk brdq'
      }
    });

    const mailOptions = {
      from: 'manasesvergara10@gmail.com',
      to: email,
      subject: 'Recuperación de Contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ message: 'Error al enviar correo de recuperación' });
      }
      res.status(200).json({ message: 'Correo de recuperación enviado si el correo está registrado.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar correo de recuperación' });
  }
};

const verificarTokenRecuperacion = async (req, res, pool) => {
  const { token, nuevaContrasena } = req.body;

  try {
    // Verificación del token
    const decoded = jwt.verify(token, 'secret_key');
    const email = decoded.email;

    // Encriptación de la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    const updateQueries = [
      'UPDATE public.encargado_feria SET contrasena = $1 WHERE user_mail = $2',
      'UPDATE public.feriante SET contrasena = $1 WHERE user_mail = $2',
      'UPDATE public.administrador_municipal SET contrasena = $1 WHERE user_mail = $2'
    ];

    // Aplicar la actualización en cada tabla
    for (const query of updateQueries) {
      await pool.query(query, [hashedPassword, email]);
    }

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Token inválido o expirado:', error);
    res.status(400).json({ message: 'Enlace de recuperación inválido o expirado' });
  }
};




module.exports = { login_encargado,login_feriante,login_municipal, registerEncargado_feria, registerFeriante, registerAdministrador_municipal, registerGoogleFeriante, recuperarContrasena, verificarTokenRecuperacion};
