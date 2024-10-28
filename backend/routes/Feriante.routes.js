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
  savePostulacion
} = require('../controllers/FerianteController');

// Rutas para actualizar y cargar datos personales
router.post('/api/actualizar-datos-personales', (req, res) => {
  actualizarDatosPersonales(req, res);
});
router.get('/api/cargar-datos-personales/:userMail', (req, res) => {
  cargarDatosPersonales(req, res);
});

// Rutas para actualizar y cargar biografía
router.post('/api/guardar-biografia', (req, res) => {
  guardarBiografia(req, res);
});
router.get('/api/cargar-biografia/:userMail', (req, res) => {
  cargarBiografia(req, res);
});

// Rutas para gestionar foto de perfil
router.post('/api/guardar-foto-perfil', (req, res) => {
  guardarFotoPerfil(req, res);
});
router.get('/api/cargar-foto-perfil/:userMail', (req, res) => {
  cargarFotoPerfil(req, res);
});

// Rutas para actualizar y cargar intereses
router.post('/api/actualizar-intereses', (req, res) => {
  actualizarIntereses(req, res);
});
router.get('/api/cargar-intereses/:userMail', (req, res) => {
  cargarIntereses(req, res);
});

// Rutas para actualizar correo
router.post('/api/actualizar-correo', (req, res) => {
  actualizarCorreo(req, res);
});

// Rutas para actualizar contraseña
router.post('/api/actualizar-contrasena', (req, res) => {
  actualizarContraseña(req, res);
});


//INICIO MODULO POSTULACIONES 
router.post('/getVacantes', (req, res) => {
  const pool = req.pool;
  getVacantesVacias(req, res, pool);
});

router.post('/savePostulacion', (req, res) => {
  const pool = req.pool;
  savePostulacion(req, res, pool);
});


module.exports = router;
