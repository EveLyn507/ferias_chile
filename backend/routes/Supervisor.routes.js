const express = require('express');
const supervisorController = require('../controllers/SupervisorController');

const router = express.Router();

// Obtener el estado de los puestos en una feria específica
router.get('/feria/:idFeria/estado', supervisorController.obtenerEstadoPuestos);

// Aceptar invitación a una feria
router.post('/invitacion/:idInvitacion/aceptar', supervisorController.aceptarInvitacion);

// Agregar comentario en un puesto específico
router.post('/puestos/comentario', supervisorController.agregarComentario);

// Obtener alertas de incidentes en una feria específica
router.get('/feria/:idFeria/alertas', supervisorController.obtenerAlertas);

module.exports = router;