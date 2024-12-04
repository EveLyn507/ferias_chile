const express = require('express');
const router = express.Router();
const {
    obtenerEstadoFeria,
    getPuestos,
    togglePuestoEstado,
    obtenerMapaFeria,
    obtenerFeriantesActivos,
    getFeriantesPendientes,
    registrarPago,
    obtenerHorario,
    obtenerFechasContratos,
} = require('../controllers/SupervisorController');

// Obtener el estado de las ferias
router.get('/estado-feria', (req, res) => {
    const pool = req.pool;
    obtenerEstadoFeria(req, res, pool);
});

// Obtener el listado de puestos para gestionar el estado
router.get('/puestos/:id_feria', (req, res) => {
    const pool = req.pool;
    getPuestos(req, res, pool);
});

// Actualizar el estado de un puesto específico
router.put('/puestos/:id_puesto/estado', (req, res) => {
    const pool = req.pool;
    togglePuestoEstado(req, res, pool);
});

// Obtener el mapa de una feria específica
router.get('/feria/mapa', (req, res) => {
    const pool = req.pool;
    obtenerMapaFeria(req, res, pool);
});

// Obtener la lista de feriantes activos en las ferias
router.get('/feriantes-activos/:id_feria', (req, res) => {
    const pool = req.pool;
    obtenerFeriantesActivos(req, res, pool);
});

// Obtener la lista de feriantes pendientes de pago
router.get('/feriantes-pendientes', (req, res) => {
  const pool = req.pool;
  getFeriantesPendientes(req, res, pool);
});

// Obtener HORARIOS DE LOS SUPERVISORES
router.get('/obtener-horario/', (req, res) => {
    const pool = req.pool;
    obtenerHorario(req, res, pool);
  });
  

// Registrar el pago físico de un feriante
router.put('/feriantes/:id_user_fte/pago', (req, res) => {
    const pool = req.pool;
    registrarPago(req, res, pool);
});


/// fechas

router.get('/fechas-contratos/:id_feria', (req, res) => {
    const pool = req.pool;
    obtenerFechasContratos(req, res, pool);
  });
  

module.exports = router;
