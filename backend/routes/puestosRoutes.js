const express = require('express');
const router = express.Router();
const { saveFeria, getFeria } = require('../controllers/puestosController');

// Ruta para guardar una feria
router.post('/api/feria', saveFeria); // Cambiado para incluir '/api'

// Ruta para obtener una feria por ID
router.get('/api/feria/:id', getFeria);

module.exports = router;
