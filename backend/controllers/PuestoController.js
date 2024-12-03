// controllers/PuestoController.js

const getPuestos = async (req, res) => {
  const pool = req.pool;
  const id_feria = parseInt(req.params.id_feria, 10);
  try {
    const result = await pool.query(
      `SELECT p.id_puesto, p.numero, p.id_tipo_puesto, p.descripcion, p.id_estado_puesto, p.id_feria,
              h.hora_inicio, h.hora_termino, h.precio
       FROM puesto p
       LEFT JOIN horario_puesto h ON p.id_puesto = h.id_puesto
       WHERE p.id_feria = $1`,
      [id_feria]
    );
    res.json(result.rows); 
  } catch (err) {
    console.error("Error al obtener los puestos:", err);
    res.status(500).send("Error al obtener los puestos");
  }
};
const createPuesto = async (req, res) => {
  const { numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto, horarioData } = req.body; 
  const pool = req.pool;

  try {
    const result = await pool.query(
      'INSERT INTO puesto (numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto]
    );

    const nuevoPuesto = result.rows[0]; 

    // Si hay datos de horario, insértalos y añádelos al objeto de respuesta
    if (horarioData) {
      const { hora_inicio, hora_termino, precio, num_horario } = horarioData;
      const horarioResult = await pool.query(
        `INSERT INTO horario_puesto (hora_inicio, hora_termino, precio, num_horario, id_puesto)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [hora_inicio, hora_termino, precio, num_horario, nuevoPuesto.id_puesto]
      );

      nuevoPuesto.horarioData = horarioResult.rows[0];
    } else {
      nuevoPuesto.horarioData = null;
    }

    res.status(201).json(nuevoPuesto);
  } catch (err) {
    console.error('Error al crear puesto:', err);
    res.status(500).json({ error: 'Error al crear puesto', details: err.message });
  }
};
  
  const deletePuesto = async (req, res) => {
    const pool = req.pool;
    const { id_puesto } = req.params;
  
    try {
      await pool.query('DELETE FROM puesto WHERE id_puesto = $1', [id_puesto]);
      res.status(204).send(); // No content
    } catch (err) {
      console.error('Error al eliminar puesto:', err);
      res.status(500).send('Error al eliminar puesto');
    }
  };

  const insertHorarioPuesto = async (req, res) => {
    const { hora_inicio, hora_termino, precio, num_horario, id_puesto } = req.body; 
    const pool = req.pool;

    try {
        const puestoExistsQuery = await pool.query(
            `SELECT id_puesto FROM puesto WHERE id_puesto = $1`,
            [id_puesto]
        );

        if (puestoExistsQuery.rows.length === 0) {
            return res.status(400).json({ error: `El puesto con id ${id_puesto} no existe.` });
        }

        const result = await pool.query(
            `INSERT INTO horario_puesto (hora_inicio, hora_termino, precio, num_horario, id_puesto)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [hora_inicio, hora_termino, precio, num_horario, id_puesto]
        );

        res.status(201).json(result.rows[0]); 
    } catch (error) {
        console.error('Error al insertar en horario_puesto:', error);
        res.status(500).json({ error: 'Error al insertar en horario_puesto' });
    }
};

const updatePuesto = async (req, res) => {
  const { id_puesto } = req.params;
  const { numero, id_tipo_puesto, descripcion, id_estado_puesto, horarioData } = req.body; 
  const pool = req.pool;

  if (!numero || !id_tipo_puesto || !descripcion || !id_estado_puesto) {
    return res.status(400).json({ error: 'Faltan datos para actualizar el puesto' });
  }

  try {
    const puestoResult = await pool.query(
      'SELECT * FROM puesto WHERE id_puesto = $1',
      [id_puesto]
    );

    if (puestoResult.rows.length === 0) {
      return res.status(404).json({ error: `Puesto con id ${id_puesto} no encontrado.` });
    }

    const updateResult = await pool.query(
      'UPDATE puesto SET numero = $1, id_tipo_puesto = $2, descripcion = $3, id_estado_puesto = $4 WHERE id_puesto = $5 RETURNING *',
      [numero, id_tipo_puesto, descripcion, id_estado_puesto, id_puesto]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: `No se pudo actualizar el puesto con id ${id_puesto}.` });
    }

    const puestoActualizado = updateResult.rows[0];

    if (horarioData) {
      const { hora_inicio, hora_termino, precio, num_horario } = horarioData;
      const horarioResult = await pool.query(
        `SELECT * FROM horario_puesto WHERE id_puesto = $1 AND num_horario = $2`,
        [id_puesto, num_horario]
      );

      if (horarioResult.rows.length > 0) {
        const updatedHorario = await pool.query(
          `UPDATE horario_puesto 
           SET hora_inicio = $1, hora_termino = $2, precio = $3 
           WHERE id_puesto = $4 AND num_horario = $5 
           RETURNING *`,
          [hora_inicio, hora_termino, precio, id_puesto, num_horario]
        );
        puestoActualizado.horarioData = updatedHorario.rows[0];
      } else {
        const horarioInsertResult = await pool.query(
          `INSERT INTO horario_puesto (hora_inicio, hora_termino, precio, num_horario, id_puesto) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [hora_inicio, hora_termino, precio, num_horario, id_puesto]
        );
        puestoActualizado.horarioData = horarioInsertResult.rows[0];
      }
    }

    res.status(200).json(puestoActualizado);

  } catch (err) {
    console.error('Error al actualizar puesto:', err);
    res.status(500).json({ error: 'Error al actualizar el puesto', details: err.message });
  }
};


  
  module.exports = {
    getPuestos,
    createPuesto,
    deletePuesto,
    insertHorarioPuesto,
    updatePuesto
  };
  