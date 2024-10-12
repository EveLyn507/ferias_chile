const express = require('express');
const { getPuestos, savePuestos, getPlano, getCalles,saveCalles,getAreas, saveAreas} = require('../controllers/puestosController.js');
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
///////

router.get('/calles', (req, res) => {
  const pool = req.pool; 
  getCalles(req, res, pool);
});

router.post('/calles', (req, res) => {
  const pool = req.pool; 
  saveCalles(req, res, pool);
});

router.get('/areas', (req, res) => {
  const pool = req.pool; 
  getAreas(req, res, pool);
});

router.post('/areas', (req, res) => {
  saveAreas(req, res, req.pool); // Agregar esta ruta
});



module.exports = router;


