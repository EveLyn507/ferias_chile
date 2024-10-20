// routes/Puesto.routes.js

const express = require('express');
const router = express.Router();
const { getPuestos, createPuesto, deletePuesto } = require('../controllers/PuestoController');

// Obtener todos los puestos de una feria
router.get('/api/puestos/:id_feria', getPuestos);

// Crear un nuevo puesto
router.post('/api/puestos', createPuesto);


// Eliminar un puesto por ID
router.delete('/api/puestos/:id_puesto', deletePuesto);

module.exports = router;
