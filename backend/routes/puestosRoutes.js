const express = require('express');
const { getPuestos, savePuestos, getPlano } = require('../controllers/puestosController.js');
const router = express.Router();

// Ruta para obtener los puestos
router.get('/puestos', (req, res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  getPuestos(req, res, pool);
});

// Ruta para guardar los puestos y las dimensiones
router.post('/puestos', (req, res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  savePuestos(req, res, pool);
});

// Ruta para obtener las dimensiones del plano
router.get('/plano', (req, res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  getPlano(req, res, pool);
});

module.exports = router;
