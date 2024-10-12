const express = require('express');
const router = express.Router();
const { guardarPerfil } = require('../controllers/perfilferianteController');

// Ruta para guardar el perfil
router.post('/perfil', guardarPerfil);

module.exports = router;
