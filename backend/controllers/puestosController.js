const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Obtener todos los puestos
const getPuestos = async (_req, res, pool) => {
    try {
      const result = await pool.query('SELECT * FROM puestos');
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener los puestos:', err);
      res.status(500).send('Error al obtener los puestos');
    }
  };
  
  // Guardar puestos y dimensiones
  const savePuestos = async (req, res, pool) => {
    const { rectangles, planWidth, planHeight } = req.body;
    try {
      await pool.query('DELETE FROM puestos'); // Limpiar tabla antes de insertar nuevos datos
      for (const rect of rectangles) {
        await pool.query(
          'INSERT INTO puestos (id, x, y, width, height, fill) VALUES ($1, $2, $3, $4, $5, $6)',
          [rect.id, rect.x, rect.y, rect.width, rect.height, rect.fill]
        );
      }
      // Guardar las dimensiones del plano
      await pool.query(
        'INSERT INTO plano (id, width, height) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET width = $2, height = $3',
        [1, planWidth, planHeight]
      );
      res.status(200).send('Datos guardados correctamente');
    } catch (err) {
      console.error('Error al guardar los datos:', err);
      res.status(500).send('Error al guardar los datos');
    }
  };
  
  // Obtener las dimensiones del plano
  const getPlano = async (req, res, pool) => {
    try {
      const result = await pool.query('SELECT * FROM plano WHERE id = 1');
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error al obtener las dimensiones del plano:', err);
      res.status(500).send('Error al obtener las dimensiones del plano');
    }
  };
  
  module.exports = {
    getPuestos,
    savePuestos,
    getPlano,
  };
  