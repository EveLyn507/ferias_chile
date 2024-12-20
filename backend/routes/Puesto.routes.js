// routes/Puesto.routes.js

const express = require('express');
const router = express.Router();
const { getPuestos, createPuesto, deletePuesto, insertHorarioPuesto,updatePuesto } = require('../controllers/PuestoController');

// Obtener todos los puestos de una feria
router.get('/api/puestos/:id_feria', getPuestos);

// Crear un nuevo puesto
router.post('/api/puestos', createPuesto);

/// ACTUALIZAR UN PUESTO
router.post('/api/puestos/:id_puesto', updatePuesto);


// Eliminar un puesto por ID
router.delete('/api/puestos/:id_puesto', deletePuesto);

router.post('/api/horario_puesto', insertHorarioPuesto);

module.exports = router;
