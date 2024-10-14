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

////////

const getCalles = async (_req, res, pool) => {
  try {
    const result = await pool.query('SELECT * FROM calles');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener las calles:', err);
    res.status(500).send('Error al obtener las calles');
  }
};


const saveCalles = async (req, res, pool) => {
  const { streets } = req.body; 
  console.log('Datos de calles recibidos:', streets); // Para depuración
  try {
    await pool.query('DELETE FROM calles'); // Limpiar la tabla de calles antes de insertar
    for (const street of streets) {
      console.log('Insertando calle:', street); // Para depuración
      await pool.query(
        'INSERT INTO calles (id, points, width) VALUES ($1, $2, $3)',
        [street.id, street.points, street.width]
      );
    }
    res.status(200).send('Calles guardadas correctamente');
  } catch (err) {
    console.error('Error al guardar las calles:', err);
    res.status(500).send('Error al guardar las calles');
  }
};

const getAreas = async (_req, res, pool) => {
  try {
    const result = await pool.query('SELECT * FROM areas');
    res.json(result.rows); 
  } catch (err) {
    console.error('Error al obtener las áreas:', err);
    res.status(500).send('Error al obtener las áreas');
  }
};

const saveAreas = async (req, res, pool) => {
  const { areas } = req.body; 
  console.log('Datos de áreas recibidos:', areas); // Para depuración
  try {
    await pool.query('DELETE FROM areas'); // Limpiar la tabla de áreas antes de insertar
    for (const area of areas) {
      console.log('Insertando área:', area); // Para depuración
      await pool.query(
        'INSERT INTO areas (id, name, x, y, width, height) VALUES ($1, $2, $3, $4, $5, $6)',
        [area.id, area.name, area.x, area.y, area.width, area.height]
      );
    }
    res.status(200).send('Áreas guardadas correctamente');
  } catch (err) {
    console.error('Error al guardar las áreas:', err);
    res.status(500).send('Error al guardar las áreas');
  }
};

const saveFeria = async (jsonData, pool) => {
  try {
    const res = await pool.query(
      'INSERT INTO json_feria (datos) VALUES ($1) RETURNING *',
      [JSON.stringify(jsonData)] // Convierte el objeto JSON a string
    );
    console.log('Feria guardada:', res.rows[0]);
  } catch (err) {
    console.error('Error al guardar la feria:', err);
  }
};
  
  module.exports = {
    getPuestos,
    savePuestos,
    getPlano,
    getCalles,
    saveCalles,
    getAreas,
    saveAreas,
    saveFeria
  };
  