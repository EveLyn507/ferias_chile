const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const pool = require('../server');
const { OAuth2Client } = require('google-auth-library');//npm install google-auth-library
const nodemailer = require('nodemailer'); // npm install nodemailer
const { use } = require('../routes/Encargado.routes');

// Cargar variables de entorno
dotenv.config();



// LOGIN -> BUSCA Y EXTRAE EL USUARIO QUE SE LOGEA
const login_encargado = async (req, res, pool) => {
  const { mail, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM public.encargado_feria WHERE user_mail = $1', [mail]);
    const user = result.rows[0];
    const role = user.id_tipo_usuario;
    const email = user.user_mail;
    const id_user = user.id_user_enf;
    const nombre = id_user+user.nombre + user.apellido
    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    
    const token = jwt.sign({ id: nombre, email: email }, 'your-secret-key', {
      expiresIn: '24h', // Duración del token
    });    

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
    const role = user.id_tipo_usuario;
    const email = user.user_mail;
    const id_user = user.id_user_fte;
    const nombre = id_user+user.nombre + user.apellido

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }


    const token = jwt.sign({ id: nombre, email: email }, 'your-secret-key', {
      expiresIn: '24h', // Duración del token
    });    

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
    const role = user.id_tipo_usuario;
    const email = user.user_mail;
    const id_user = user.id_user_adm;
    const nombre = id_user+user.nombre + user.apellido

    if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: nombre, email: email }, 'your-secret-key', {
      expiresIn: '24h', // Duración del token
    });  
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
    console.error('Error en el registro:', error); 
    res.status(500).json({ message: 'Error interno del servidor' });
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
const registerGoogleFeriante = async (req, res, pool) => {
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

    // Verificar si el usuario ya está registrado
    const result = await pool.query('SELECT * FROM public.feriante WHERE user_mail = $1', [user_mail]);
    const existingUser = result.rows[0];

    if (existingUser) {
      // Si el usuario ya existe, generar un token y devolverlo
      const token = jwt.sign(
        { id: existingUser.id_user_fte, email: existingUser.user_mail },
        'your-secret-key',
        { expiresIn: '24h' }
      );
      return res.status(200).json({
        token,
        role: existingUser.id_tipo_usuario,
        email: existingUser.user_mail,
        id_user: existingUser.id_user_fte,
      });
    }

    // Si el usuario no existe, registrarlo
    const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
    const insertResult = await pool.query(
      `INSERT INTO public.feriante (user_mail, nombre, apellido, contrasena, id_tipo_usuario, perfil_privado, rut, rut_div)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_user_fte`,
      [user_mail, nombre, apellido, hashedPassword, 2, false, '0','0'] 
    );

    const id_user = insertResult.rows[0].id_user_fte;
    const token = jwt.sign({ id: id_user, email: user_mail }, 'your-secret-key', { expiresIn: '24h' });

    return res.status(201).json({ token, role: 2, email: user_mail, id_user });
  } catch (error) {
    console.error('Error en el registro con Google:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

// Actualizar contraseña mediante correo
const actualizarContrasena = async (req, res, pool) => {
  const { email, nuevaContrasena } = req.body;

  try {
    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);
    const updateQueries = [
      'UPDATE public.encargado_feria SET contrasena = $1 WHERE user_mail = $2',
      'UPDATE public.feriante SET contrasena = $1 WHERE user_mail = $2',
      'UPDATE public.administrador_municipal SET contrasena = $1 WHERE user_mail = $2'
    ];

    let updated = false;

    // Actualizar la contraseña en las tablas correspondientes
    for (const query of updateQueries) {
      const result = await pool.query(query, [hashedPassword, email]);
      if (result.rowCount > 0) {
        updated = true;
        break;
      }
    }

    if (!updated) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};




module.exports = { login_encargado,login_feriante,login_municipal, registerEncargado_feria, registerFeriante, registerAdministrador_municipal, registerGoogleFeriante, actualizarContrasena};
