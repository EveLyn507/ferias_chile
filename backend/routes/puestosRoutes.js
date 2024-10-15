const express = require('express');
const { getPuestos, savePuestos, getPlano, getCalles, saveCalles, getAreas, saveAreas, saveFeria } = require('../controllers/puestosController.js');
const router = express.Router();


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

router.get('/api/feria/:id', (req, res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  getFeria(req, res, pool); // Llamar la nueva función para obtener la feria
});

module.exports = router;


