const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../server.js');


// Controlador para guardar la feria


const saveFeria = async (req, res) => {
  const { puestos, areas, calles, id_feria } = req.body; // Incluye id_feria en la desestructuración

  const pool = req.pool;

  try {
      const queryText = `
          INSERT INTO json_feria (nombre_json, id_feria)
          VALUES ($1, $2)
          RETURNING id_json
      `;

      // Crear un objeto que contenga todos los datos en JSONB
      const nombre_json = {
          puestos,
          areas,
          calles,
      };

      // Asegúrate de pasar el id_feria desde el cuerpo de la solicitud
      const values = [JSON.stringify(nombre_json), id_feria]; // Usa id_feria aquí

      const result = await pool.query(queryText, values);
      res.status(201).json({ id_feria: result.rows[0].id_json });
  } catch (error) {
      console.error('Error al guardar la feria:', error);
      res.status(500).json({ error: 'Error al guardar la feria' });
  }
};
// Controlador para obtener la feria
const getFeria = async (req, res) => {
  const pool = req.pool;

  try {
    const result = await pool.query('SELECT nombre_json FROM json_feria WHERE id_feria = $1', [req.params.id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].nombre_json);
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
