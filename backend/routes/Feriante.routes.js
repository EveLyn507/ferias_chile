const express = require('express');
const router = express.Router();
const {
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
  getVacantesVacias,
  insertPostulacion
} = require('../controllers/FerianteController');

// Rutas para actualizar y cargar datos personales
router.post('/api/actualizar-datos-personales', (req, res) => {
  const pool = req.pool;
  const { userMail, nombre, apellido, telefono , id_user } = req.body;
  actualizarDatosPersonales( res,pool , userMail, nombre, apellido, telefono , id_user);
});


router.get('/api/cargar-datos-personales/:id_user', (req, res) => {
  const pool = req.pool;
  const { id_user } = req.params;
  cargarDatosPersonales( res,pool,id_user);
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


module.exports = router;
