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
    getFechasDisponibles,
    getPuestosDisponibles,
    createContrato,
} = require('../controllers/SupervisorController');

// Obtener el estado de las ferias
router.get('/estado-feria', (req, res) => {
    const pool = req.pool;
    obtenerEstadoFeria(req, res, pool);
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
router.post('/feriantes-activos/:id_feria/:fecha', (req, res) => {
    const pool = req.pool;
    obtenerFeriantesActivos(req, res, pool);
});

// Obtener la lista de feriantes pendientes de pago
router.get('/feriantes-pendientes', (req, res) => {
  const pool = req.pool;
  getFeriantesPendientes(req, res, pool);
});

// Obtener el listado de puestos para gestionar el estado
router.post('/getPuestosFTE', (req, res) => {
  const pool = req.pool;
  const  {id_feria , fecha} = req.body
  getPuestos( res, pool , id_feria , fecha);
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



router.get('/fechas-mapas/:id_feria/fechas', (req, res) => {
    const pool = req.pool;
    getFechasDisponibles(req, res, pool);
  });
  
/// puestos disp

router.post('/getPuestosDisponibles', (req, res) => {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',req.query);
    const pool = req.pool;
    const {id_feria , fecha} = req.body;

    getPuestosDisponibles(res, pool, id_feria , fecha);
  });

// Ruta para insertar contrato

router.post('/insert', (req, res) => {
  const pool = req.pool;
  const {id_arriendo_puesto , usuarioFisico , precio} = req.body;
  createContrato(res , pool, id_arriendo_puesto , usuarioFisico , precio);
});
module.exports = router;
