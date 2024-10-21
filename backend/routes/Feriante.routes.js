const express = require('express');
const router = express.Router();
const { guardarPerfil, obtenerPerfil, guardarFotoPerfil, cargarFotoPerfil, actualizarCorreo, actualizarContraseña } = require('../controllers/FerianteController');

// Ruta para obtener el perfil
router.get('/api/perfil/:userMail', (req, res) => {
  const pool = req.pool;
  obtenerPerfil(req, res, pool);
});

// Ruta para guardar el perfil
router.post('/api/perfil', (req, res) => {
  const pool = req.pool; 
  guardarPerfil(req, res, pool); 
});

// Ruta para guardar la foto de perfil
router.post('/api/foto', (req, res) => {
  const pool = req.pool;
  guardarFotoPerfil(req, res, pool);
});

// Ruta para cargar la foto de perfil desde la carpeta uploads
router.get('/api/foto/:userMail', (req, res) => {
  cargarFotoPerfil(req, res);
});

// Rutas para actualizar correo y contraseña
router.post('/api/actualizar-correo', (req, res) => {
  const pool = req.pool;
  actualizarCorreo(req, res, pool);
});

router.post('/api/actualizar-contraseña', (req, res) => {
  const pool = req.pool;
  actualizarContraseña(req, res, pool);
});

module.exports = router;
