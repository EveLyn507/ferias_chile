// controllers/PuestoController.js

const getPuestos = async (req, res) => {
    const pool = req.pool;
    const id_feria = parseInt(req.params.id_feria, 10);
    console.log('aaaa aqui va el id', id_feria)
    try {
      const result = await pool.query('SELECT public.contar_puestos_actuales($1)', [id_feria]);
      const totalpuestos = result.rows[0].contar_puestos_actuales
      console.log('aqui esta el result',result)
      console.log('aqui esta el result.rows',result.rows)
      console.log('aqui esta el result rows contar',result.rows.contar_puestos_actuales)
      console.log('aqui esta la wea completa',result.rows[0].contar_puestos_actuales)
      res.json(totalpuestos)
    } catch (err) {
      console.error('Error al obtener los puestos:', err);
      res.status(500).send('Error al obtener los puestos');
    }
  };
  
  const createPuesto = async (req, res) => {
    const { numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto, horarioData } = req.body; // Añadir horario al body
    const pool = req.pool;
  
    try {
      // Insertar el puesto
      const result = await pool.query(
        'INSERT INTO puesto (numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto]
      );
  
      const nuevoPuesto = result.rows[0]; // Obtener el puesto creado
  
      // Verificar si hay datos de horario que insertar
      if (horarioData) {
        const { hora_inicio, hora_termino, precio, num_horario } = horarioData;
  
        // Llamar a insertHorarioPuesto pasando el id del nuevo puesto
        const horarioResult = await pool.query(
          `INSERT INTO horario_puesto (hora_inicio, hora_termino, precio, num_horario, id_puesto)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [hora_inicio, hora_termino, precio, num_horario, nuevoPuesto.id_puesto]
        );
  
        // Agregar el horario insertado al puesto creado
        nuevoPuesto.horarioData = horarioResult.rows[0];
        console.log(nuevoPuesto);
        
      }
  
      res.status(201).json(nuevoPuesto); // Devolver el puesto creado con su horario, si lo hay
    } catch (err) {
      console.error('Error al crear puesto:', err); // Detalles del error
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
    const { hora_inicio, hora_termino, precio, num_horario, id_puesto } = req.body;  // Capturamos los datos enviados desde el frontend
    const pool = req.pool;

    try {
        // Verificar si el puesto existe antes de insertar en horario_puesto
        const puestoExistsQuery = await pool.query(
            `SELECT id_puesto FROM puesto WHERE id_puesto = $1`,
            [id_puesto]
        );

        if (puestoExistsQuery.rows.length === 0) {
            // Si el puesto no existe, devolver un error
            return res.status(400).json({ error: `El puesto con id ${id_puesto} no existe.` });
        }

        // Insertar el registro en la tabla horario_puesto
        const result = await pool.query(
            `INSERT INTO horario_puesto (hora_inicio, hora_termino, precio, num_horario, id_puesto)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [hora_inicio, hora_termino, precio, num_horario, id_puesto]
        );

        res.status(201).json(result.rows[0]);  // Devolver el registro insertado
    } catch (error) {
        console.error('Error al insertar en horario_puesto:', error);
        res.status(500).json({ error: 'Error al insertar en horario_puesto' });
    }
};


  
  module.exports = {
    getPuestos,
    createPuesto,
    deletePuesto,
    insertHorarioPuesto
  };
  