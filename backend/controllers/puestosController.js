const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');


const saveFeria = async (jsonData, pool) => {
  try {
    const { puestos, areas, calles, encargadoId } = jsonData; // Desestructuramos el objeto
    const res = await pool.query(
      'INSERT INTO ferias (datos, encargado_id) VALUES ($1, $2) RETURNING *',
      [JSON.stringify({ puestos, areas, calles }), encargadoId] // Guardamos el JSON y el ID del encargado
    );
    console.log('Feria guardada:', res.rows[0]);
  } catch (err) {
    console.error('Error al guardar la feria:', err);
  }
};


const getFeria = async (req, res, pool) => {
  try {
    const result = await pool.query('SELECT datos FROM json_ferias WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].datos); 
    } else {
      res.status(404).json({ error: 'Feria no encontrada' });
    }
  } catch (err) {
    console.error('Error al obtener la feria:', err);
    res.status(500).json({ error: 'Error al obtener la feria' });
  }
};

  
  module.exports = {

    saveFeria,
    getFeria
  };
  