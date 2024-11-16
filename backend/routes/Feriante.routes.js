const express = require('express');
const router = express.Router();
const {
  getEstadoPerfil,
  togglePerfilPrivado,
  actualizarDatosPersonales,
  cargarDatosPersonales,
  guardarBiografia,
  cargarBiografia,
  guardarFotoPerfil,
  cargarFotoPerfil,
  actualizarIntereses,
  cargarIntereses,
  actualizarCorreo,
  actualizarContraseña,
  obtenerTiposRed,
  obtenerRedesSociales,
  agregarRedSocial,
  eliminarRedSocial,
  getVacantesVacias,//modulo postulaciones
  insertPostulacion,
  misPostulaciones
} = require('../controllers/FerianteController');

// Ruta para obtener el estado del perfil
router.get('/api/perfil/estado/:userMail', (req, res) => {
  const pool = req.pool;
 getEstadoPerfil (req, res,pool);
});

// Ruta para alternar el estado del perfil público/privado
router.put('/api/perfil/toggle-privado',  (req, res) => {
  const pool = req.pool;
togglePerfilPrivado (req, res,pool);
});

// Rutas para actualizar y cargar datos personales
router.post('/api/actualizar-datos-personales', (req, res) => {
  const { nombre, apellido, telefono, id_user } = req.body; 
  actualizarDatosPersonales(res, req.pool, nombre, apellido, telefono, id_user);
});

router.get('/api/cargar-datos-personales/:id_user', (req, res) => {
  console.log('Ruta /api/cargar-datos-personales llamada');
  console.log('req.params:', req.params); // Comprobar si id_user se envía correctamente

  const pool = req.pool;
  const { id_user } = req.params;

  console.log('Pasando al controlador cargarDatosPersonales con id_user:', id_user);
  cargarDatosPersonales(req, res); // No se pasa `pool` aquí, ya que está en `req.pool`
});

// Rutas para actualizar y cargar biografía
router.post('/api/guardar-biografia', (req, res) => {
  const pool = req.pool;
  const { userMail, biografia,id_user } = req.body;
  guardarBiografia(id_user, biografia, res,pool);
});


router.get('/api/cargar-biografia/:id_user', (req, res) => {
  const pool = req.pool;
  const {id_user} = req.params
  cargarBiografia( res,id_user ,pool);
});

// Rutas para gestionar foto de perfil
router.post('/api/guardar-foto-perfil', (req, res) => {
  const pool = req.pool;
  guardarFotoPerfil(req, res,pool);
});
router.get('/api/cargar-foto-perfil/:userMail', (req, res) => {
  const pool = req.pool;
  cargarFotoPerfil(req, res,pool);
});

// Rutas para actualizar y cargar intereses
router.post('/api/actualizar-intereses', (req, res) => {
  const { id_user, intereses } = req.body;
  const pool = req.pool;
  actualizarIntereses( res,pool, id_user, intereses);
});
router.get('/api/cargar-intereses/:id_user', (req, res) => {
  const pool = req.pool;
  const { id_user } = req.params;
  cargarIntereses(res, pool, id_user);
});

// Rutas para actualizar correo
router.post('/api/actualizar-correo', (req, res) => {
  const pool = req.pool;
  actualizarCorreo(req, res,pool);
});

// Rutas para actualizar contraseña
router.post('/api/actualizar-contrasena', (req, res) => {
  actualizarContraseña(req, res);
});

// Rutas para las redes sociales
router.get('/api/tipos-red',  (req, res) => {
  const pool = req.pool;
  obtenerTiposRed (req, res,pool);
});

router.get('/api/redes-sociales/:userMail',  (req, res) => {
  const pool = req.pool;
  obtenerRedesSociales (req, res,pool);
});

router.post('/api/redes-sociales',  (req, res) => {
  const pool = req.pool;
  agregarRedSocial (req, res,pool);
});

router.put('/api/redes-sociales/:id',  (req, res) => {
  const pool = req.pool;
  eliminarRedSocial (req, res,pool);
});

//INICIO MODULO POSTULACIONES 
router.post('/getVacantesVacias', (req, res) => {
  const pool = req.pool;
  getVacantesVacias(res, pool);
});

router.post('/insertPostulacion', (req, res) => {
  const pool = req.pool;
  const {id_user_fte , user_mail, id_vacante} = req.body.postulacion
  insertPostulacion(res, pool,id_user_fte , user_mail, id_vacante );
});

router.post('/getMisPostulaciones', (req, res) => {
  const pool = req.pool;
  const {id_user_fte} = req.body
  misPostulaciones(res, pool,id_user_fte);
});



module.exports = router;
