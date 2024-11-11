// Obtener el estado de la feria
const obtenerEstadoFeria = async (req, res, pool) => {
  try {
    const query = `
      SELECT f.id_feria, ef.estado AS estado_feria
      FROM feria f
      JOIN estado_feria ef ON f.id_estado = ef.id_estado;
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener el estado de la feria:', error);
    res.status(500).json({ message: 'Error al obtener el estado de la feria' });
  }
};

// Obtener el listado de puestos para gestionar el estado (habilitar/bloquear)
const getPuestos = async (req, res, pool) => {
  try {
    const puestos = await pool.query(`
      SELECT p.id_puesto, p.numero, ep.estado
      FROM puesto p
      JOIN estado_puesto ep ON p.id_estado_puesto = ep.id_estado_puesto
    `);
    res.status(200).json(puestos.rows);
  } catch (error) {
    console.error('Error al obtener puestos:', error);
    res.status(500).json({ message: 'Error al obtener puestos' });
  }
};

// Actualizar el estado de un puesto
const togglePuestoEstado = async (req, res, pool) => {
  const { id_puesto } = req.params;
  const { estado } = req.body;

  if (!id_puesto || !estado) {
    return res.status(400).json({ message: 'Parámetros inválidos' });
  }

  try {
    const nuevoEstado = estado === 'Disponible' ? 1 : 2; // Supón que 1 es Disponible y 2 es Bloqueado
    await pool.query('UPDATE puesto SET id_estado_puesto = $1 WHERE id_puesto = $2', [nuevoEstado, id_puesto]);
    res.status(200).json({ message: 'Estado del puesto actualizado' });
  } catch (error) {
    console.error('Error al actualizar el estado del puesto:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del puesto' });
  }
};

// Obtener el mapa de la feria
const obtenerMapaFeria = async (req, res, pool) => {
  try {
    const query = 'SELECT * FROM feria WHERE id_feria = $1';
    const result = await pool.query(query, [req.query.id_feria]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener el mapa de la feria:', error);
    res.status(500).json({ message: 'Error al obtener el mapa de la feria' });
  }
};

// Obtener feriantes activos en cada feria
const obtenerFeriantesActivos = async (req, res, pool) => {
  try {
    const feriantes = await pool.query(`
      SELECT f.id_user_fte, f.nombre, f.apellido, ec.detalle AS estado_pago
      FROM feriante f
      JOIN contrato_puesto cp ON f.id_user_fte = cp.id_user_fte
      JOIN tipo_estado_contrato ec ON cp.estado_contrato = ec.id_status_contrato
      WHERE ec.detalle != 'finalizado' AND ec.detalle != 'cancelado'
    `);
    res.status(200).json(feriantes.rows);
  } catch (error) {
    console.error('Error al obtener lista de pagos pendientes:', error);
    res.status(500).json({ message: 'Error al obtener lista de pagos pendientes' });
  }
};

// Obtener feriantes pendientes de pago
const getFeriantesPendientes = async (req, res, pool) => {
  try {
    const feriantes = await pool.query(`
      SELECT f.id_user_fte, f.nombre, f.apellido, tec.detalle AS estado_pago
      FROM feriante f
      JOIN contrato_puesto cp ON f.id_user_fte = cp.id_user_fte
      JOIN tipo_estado_contrato tec ON cp.estado_contrato = tec.id_status_contrato
      WHERE tec.detalle != 'finalizado' AND tec.detalle != 'cancelado';
    `);
    res.status(200).json(feriantes.rows);
  } catch (error) {
    console.error('Error al obtener lista de pagos pendientes:', error);
    res.status(500).json({ message: 'Error al obtener lista de pagos pendientes' });
  }
};

// Registrar el pago físico de un feriante
const registrarPago = async (req, res, pool) => {
  const { id_user_fte } = req.params;
  try {
    await pool.query('UPDATE feriante SET pagado = TRUE WHERE id_user_fte = $1', [id_user_fte]);
    res.status(200).json({ message: 'Pago registrado exitosamente' });
  } catch (error) {
    console.error('Error al registrar pago físico:', error);
    res.status(500).json({ message: 'Error al registrar pago físico' });
  }
};


const aceptarPostulacion = async (req, res) => {
  const { id_postulacion, id_feria } = req.body;

  try {
      // Actualizar el estado de la postulación a "aceptado"
      await pool.query('UPDATE postulaciones SET estado = $1 WHERE id_postulacion = $2', ['aceptado', id_postulacion]);

      // Obtener información de la feria vinculada a la postulación
      const feriaDetalles = await pool.query(
          'SELECT * FROM feria WHERE id_feria = $1',
          [id_feria]
      );

      res.status(200).json({ feriaDetalles: feriaDetalles.rows[0] });
  } catch (error) {
      console.error('Error al aceptar la postulación:', error);
      res.status(500).json({ message: 'Error al aceptar la postulación' });
  }
};


module.exports = {
  obtenerEstadoFeria,
  obtenerFeriantesActivos,
  obtenerMapaFeria,
  getPuestos,
  togglePuestoEstado,
  getFeriantesPendientes,
  registrarPago,
  aceptarPostulacion
};
