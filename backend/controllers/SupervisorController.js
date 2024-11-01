

// Obtener el estado de las ferias activas
const obtenerEstadoFeria = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT nombre, COUNT(id_puesto) AS total_puestos, 
      COUNT(id_puesto) FILTER (WHERE estado = 'Ocupado') AS ocupacion
      FROM feria
      JOIN puesto ON feria.id_feria = puesto.id_feria
      WHERE feria.estado = 'Activa'
      GROUP BY nombre
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el estado de las ferias activas' });
  }
};

// Obtener el mapa de la feria
const obtenerMapaFeria = async (req, res) => {
  try {
    const result = await pool.query(`SELECT url_mapa FROM feria WHERE id_feria = $1`, [req.params.idFeria]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Mapa no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el mapa de la feria' });
  }
};

// Obtener alertas e incidentes
const obtenerAlertas = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM alertas WHERE estado = 'Activa'`);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

// Obtener lista de puestos y sus comentarios
const obtenerPuestos = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM puesto`);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los puestos' });
  }
};

// Agregar comentario a un puesto
const agregarComentarioPuesto = async (req, res) => {
  const { idPuesto } = req.params;
  const { comentario } = req.body;
  try {
    await pool.query(
      `INSERT INTO comentarios (id_puesto, comentario) VALUES ($1, $2)`,
      [idPuesto, comentario]
    );
    res.status(201).json({ message: 'Comentario agregado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar comentario' });
  }
};

module.exports = {
  obtenerEstadoFeria,
  obtenerMapaFeria,
  obtenerAlertas,
  obtenerPuestos,
  agregarComentarioPuesto
};
