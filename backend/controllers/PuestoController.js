// controllers/PuestoController.js

const getPuestos = async (req, res) => {
    const pool = req.pool;
    const id_feria = parseInt(req.params.id_feria, 10);
    try {
      const result = await pool.query('SELECT * FROM puesto WHERE id_feria = $1', [id_feria]);
      res.json(result.rows);
    } catch (err) {
      console.error('Error al obtener los puestos:', err);
      res.status(500).send('Error al obtener los puestos');
    }
  };
  
  const createPuesto = async (req, res) => {
    const { numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto } = req.body;
    const pool = req.pool;
    
    try {
      const result = await pool.query(
        'INSERT INTO puesto (numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [numero, id_tipo_puesto, id_feria, descripcion, id_estado_puesto]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error al crear puesto:', err);
      res.status(500).send('Error al crear puesto');
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
  
  module.exports = {
    getPuestos,
    createPuesto,
    deletePuesto,
  };
  