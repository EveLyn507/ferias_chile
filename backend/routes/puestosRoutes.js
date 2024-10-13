const express = require('express');
const { getPuestos, savePuestos, getPlano, getCalles, saveCalles, getAreas, saveAreas, saveFeria } = require('../controllers/puestosController.js');
const router = express.Router();


// Ruta para obtener los puestos
router.get('/puestos', (req, res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  getPuestos(req, res, pool);
});

// Ruta para guardar los puestos y dimensiones
router.post('/puestos', (req, res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  savePuestos(req, res, pool);
});

// Ruta para obtener las dimensiones del plano
router.get('/plano', (req, res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  getPlano(req, res, pool);
});

// Rutas para calles
router.get('/calles', (req, res) => {
  const pool = req.pool; 
  getCalles(req, res, pool);
});

router.post('/calles', (req, res) => {
  const pool = req.pool; 
  saveCalles(req, res, pool);
});

// Rutas para áreas
router.get('/areas', (req, res) => {
  const pool = req.pool; 
  getAreas(req, res, pool);
});

router.post('/areas', (req, res) => {
  const pool = req.pool; 
  saveAreas(req, res, pool);
});

// Ruta para guardar una feria
router.post('/api/feria', async (req, res) => {
  const jsonData = req.body; 
  const pool = req.pool; 
  try {
      const result = await pool.query(
          'INSERT INTO ferias (datos) VALUES ($1) RETURNING *',
          [JSON.stringify(jsonData)] 
      );
      console.log('Feria guardada:', result.rows[0]);
      res.status(200).json({ message: 'Feria guardada correctamente' }); // Cambiado a JSON
  } catch (error) {
      console.error('Error al guardar la feria:', error);
      res.status(500).json({ error: 'Error al guardar la feria' }); // Cambiado a JSON
  }
});
module.exports = router;


