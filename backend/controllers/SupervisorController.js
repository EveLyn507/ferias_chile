const pool = require('../server'); 

// Obtener el estado de los puestos de la feria
exports.obtenerEstadoPuestos = async (req, res) => {
  const { idFeria } = req.params;

  try {
    const result = await pool.query(`
      SELECT p.numero, ep.estado
      FROM puesto p
      JOIN estado_puesto ep ON p.id_estado_puesto = ep.id_estado_puesto
      WHERE p.id_feria = $1
    `, [idFeria]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener estado de puestos:', error);
    res.status(500).json({ message: 'Error al obtener estado de puestos' });
  }
};

// Aceptar invitación a la feria
exports.aceptarInvitacion = async (req, res) => {
  const { idInvitacion } = req.params;
  
  try {
    const result = await pool.query(`
      UPDATE postulaciones
      SET estado = 'A'
      WHERE id_postulacion = $1
    `, [idInvitacion]);

    res.status(200).json({ message: 'Invitación aceptada' });
  } catch (error) {
    console.error('Error al aceptar invitación:', error);
    res.status(500).json({ message: 'Error al aceptar invitación' });
  }
};

// Agregar un comentario a un puesto
exports.agregarComentario = async (req, res) => {
  const { puestoId, comentario } = req.body;

  try {
    await pool.query(`
      INSERT INTO comentarios (id_puesto, comentario, fecha)
      VALUES ($1, $2, NOW())
    `, [puestoId, comentario]);

    res.status(201).json({ message: 'Comentario agregado' });
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    res.status(500).json({ message: 'Error al agregar comentario' });
  }
};

// Obtener alertas de incidentes en ferias
exports.obtenerAlertas = async (req, res) => {
  const { idFeria } = req.params;

  try {
    const result = await pool.query(`
      SELECT alerta
      FROM alertas
      WHERE id_feria = $1
    `, [idFeria]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ message: 'Error al obtener alertas' });
  }
};
