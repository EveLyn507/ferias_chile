const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();


// Lógica para login
const login = async (req, res, pool) => {
  const { mail, contrasena } = req.body;
  try {
    const result = await pool.query('SELECT * FROM public.usuario WHERE mail = $1', [mail]);
    const user = result.rows[0];

    if (!user || contrasena !== user.contrasena) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: user.id }, 'xd', { expiresIn: '1h' });
    const role =  user.id_tipo_usuario;
    const email = user.mail
    res.json({ token, role, email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al iniciar sesión');
  }
};

// Lógica para registro (ejemplo)
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

// PERFIL ENCARGADO FUNCIONES

// get id_feria nombre nombre_region nombre_comuna
const get_feria_Encargado = async (req, res, pool) => {

    const {mail} = req.body;
  try {
  
  const result = await pool.query(
     ` SELECT * FROM obtener_ferias_encargado($1);` , [mail]);
  res.json(result.rows)
  
  }catch (err){
      console.error('Error al obtener las ferias:', err);
      res.status(500).send('Error al obtener las ferias');
  
  }
  
  }

  const abrirTiketFeria = async (req, res, pool) => {
    const {id_feria , mail} = req.body;
    const admin = '3@3';
    const estado = 'En revision'
  try {
  
  const result = await pool.query(
    'SELECT insert_solicitud_apertura($1,$2,$3,$4);' , [mail,admin,id_feria,estado]);
  res.json(result.rows)
  
  }catch (err){
      console.error('Error al abrir tiket:', err);
      res.status(500).send('Error al  abrir tiket');
  
  }
  
  }

  //FUNCIONES ADMIN MUNICIPAL 

  const obtenerSolicitudes = async (req, res, pool) => {

    const {mail} = req.body;
  try {
  
  const result = await pool.query(
     ` SELECT * FROM solicitudes_apertura where admin_muni_mail = $1;` , [mail]);
  res.json(result.rows)
  
  }catch (err){
      console.error('Error al obtener las ferias:', err);
      res.status(500).send('Error al obtener las ferias');
  
  }
  
  }




module.exports = { login, register, get_feria_Encargado , abrirTiketFeria ,obtenerSolicitudes};
