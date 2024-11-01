const express = require('express');
const router = express.Router();
const {
  obtenerEstadoFeria,
  obtenerMapaFeria,
  obtenerAlertas,
  obtenerPuestos,
  agregarComentarioPuesto
} = require('../controllers/SupervisorController');

// Rutas para supervisores
router.get('/estado-feria', obtenerEstadoFeria);
router.get('/mapa-feria', obtenerMapaFeria);
router.get('/alertas', obtenerAlertas);
router.get('/puestos', obtenerPuestos);
router.post('/puestos/:idPuesto/comentario', agregarComentarioPuesto);

module.exports = router;