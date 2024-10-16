const express = require('express');
const router = express.Router();
const { guardarPerfil, obtenerPerfil, guardarFotoPerfil, actualizarCorreo,  actualizarContraseña} = require('../controllers/FerianteController');




router.post('/api/perfil', (req, res) => {
    const pool = req.pool; 
    guardarPerfil(req, res, pool); 
});

router.get('/api/perfil/:userMail', (req , res) => {
    const pool = req.pool;
    obtenerPerfil(req, res, pool);
});

router.post('/api/foto', (req , res) => {
  const pool = req.pool;
  guardarFotoPerfil(req, res, pool);
});

router.post('/api/actualizar-correo', actualizarCorreo);
router.post('/api/actualizar-contraseña', actualizarContraseña);


module.exports = router;

