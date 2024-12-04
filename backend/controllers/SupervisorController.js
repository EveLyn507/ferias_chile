const obtenerEstadoFeria = async (req, res, pool) => {
  const { id_feria } = req.query;

  // Validar que id_feria es un número válido
  if (!id_feria || isNaN(Number(id_feria))) {
    return res.status(400).json({ message: 'El id_feria debe ser un número válido' });
  }

  try {
    const idFeria = parseInt(id_feria, 10);
    const query = `
      SELECT 
        f.id_feria, 
        f.nombre, 
        c.comuna AS nombre_comuna, 
        r.region AS nombre_region, 
        ef.estado AS estado_feria
      FROM feria f
      JOIN estado_feria ef ON f.id_estado = ef.id_estado
      JOIN comuna c ON c.id_comuna = f.id_comuna
      JOIN region r ON r.id_region = c.id_region
      WHERE f.id_feria = $1;
    `;

    const result = await pool.query(query, [idFeria]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró una feria con el id proporcionado' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener el estado de la feria:', error);
    res.status(500).json({ message: 'Error al obtener el estado de la feria' });
  }
};


const obtenerHorario = async (req, res, pool) => {
  const { id_feria } = req.query;
  // Validar que id_feria es un número válido
  if (!id_feria || isNaN(id_feria)) {
    return res.status(400).json({ message: 'El id_feria debe ser un número válido' });
  }

  try {
    const query = `
      WITH horarios AS (
        SELECT 
          h.id_vacante,
          json_agg(h) AS horario_empleado
        FROM detalle_horario_empleado h
        WHERE h.id_dia = $1  -- Si id_dia es la columna que debe usarse en lugar de id_feria
        GROUP BY h.id_vacante
      )
      SELECT 
        d.id_user_fte,
        h.horario_empleado
      FROM detalle_team_vacante d
      LEFT JOIN horarios h ON d.id_vacante = h.id_vacante
      WHERE d.id_feria = $1;  -- Filtramos también por id_feria en detalle_team_vacante
    `;

    // Pasamos id_feria como parámetro
    const result = await pool.query(query, [parseInt(id_feria, 10)]); 

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron horarios para la feria con el id proporcionado' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los horarios:', error);  
    res.status(500).json({ message: 'Error al obtener los horarios de la feria' });
  }
};



// Obtener el listado de puestos para gestionar el estado (habilitar/bloquear)
const getPuestos = async (req, res, pool) => {
  try {
    const { id_feria } = req.params; // Obtener id_feria desde los parámetros de la ruta

    if (!id_feria) {
      return res.status(400).json({ message: 'El id_feria es requerido' });
    }

    const puestos = await pool.query(`
      SELECT p.id_puesto, p.numero, ep.estado
      FROM puesto p
      JOIN estado_puesto ep ON p.id_estado_puesto = ep.id_estado_puesto
      WHERE p.id_feria = $1;
    `, [id_feria]); // Pasar id_feria como parámetro

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
  let { id_feria } = req.query;

  // Si id_feria no está en req.query, intentar obtenerlo de req.params
  if (!id_feria) {
    id_feria = req.params.id_feria;
  }

  console.log('Recibiendo solicitud para obtener feriantes activos, id_feria:', id_feria);

  // Validar que id_feria es un número válido
  if (!id_feria || isNaN(id_feria)) {
    console.log('Error: id_feria no es un número válido');
    return res.status(400).json({ message: 'El id_feria debe ser un número válido' });
  }

  try {
    const query = `
      SELECT f.id_user_fte, f.nombre, f.apellido, a.id_puesto, e.estado
      FROM feriante f
      JOIN contrato_puesto c ON c.id_user_fte = f.id_user_fte
      JOIN arriendo_puesto a ON c.id_arriendo_puesto = a.id_arriendo_puesto
      JOIN estado_arriendo e ON a.id_estado_arriendo = e.id_estado_arriendo
      JOIN puesto p ON a.id_puesto = p.id_puesto
      JOIN feria fe ON p.id_feria = fe.id_feria
      WHERE fe.id_feria = $1 ;
    `;
    console.log('Consultando feriantes activos para la feria con id_feria:', id_feria);

    // Pasamos id_feria como parámetro
    const result = await pool.query(query, [parseInt(id_feria, 10)]);

    if (result.rows.length === 0) {
      console.log('No se encontraron feriantes para la feria con id_feria:', id_feria);
      return res.status(404).json({ message: 'No se encontraron feriantes para la feria con el id proporcionado' });
    }

    console.log('Feriantes activos obtenidos exitosamente:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener los feriantes activos:', error);
    res.status(500).json({ message: 'Error al obtener los feriantes de la feria' });
  }
};

// Obtener feriantes pendientes de pago
const getFeriantesPendientes = async (req, res, pool) => {
  try {
    const feriantes = await pool.query(`
      SELECT f.id_user_fte, f.nombre, f.apellido, tec.detalle AS estado_pago
      FROM feriante f
      JOIN contrato_puesto cp ON f.id_user_fte = cp.id_user_fte
      JOIN estado_contrato tec ON cp.id_estado_contrato = tec.id_estado_contrato
      WHERE tec.detalle != 'finalizado' AND tec.detalle != 'cancelado';
    `);
    res.status(200).json(feriantes.rows);
  } catch (error) {
    console.error('Error al obtener lista de pagos pendientes:', error);
    res.status(500).json({ message: 'Error al obtener lista de pagos pendientes' });
  }
};


const obtenerFechasContratos = async (req, res, pool) => {
  let { id_feria } = req.params;
  console.log('Recibiendo solicitud para obtener fechas de contratos, id_feria:', id_feria);

  // Validar que id_feria sea un número válido
  if (!id_feria || isNaN(parseInt(id_feria, 10))) {
    console.log('Error: id_feria no es un número válido');
    return res.status(400).json({ message: 'El id_feria debe ser un número válido' });
  }

  id_feria = parseInt(id_feria, 10);
  console.log('Consultando fechas de contratos para la feria con id_feria:', id_feria);

  try {
    const query = `
      SELECT c.fecha
      FROM feriante f
      JOIN contrato_puesto c ON c.id_user_fte = f.id_user_fte
      JOIN arriendo_puesto a ON c.id_arriendo_puesto = a.id_arriendo_puesto
      JOIN estado_arriendo e ON a.id_estado_arriendo = e.id_estado_arriendo
      JOIN puesto p ON a.id_puesto = p.id_puesto
      JOIN feria fe ON p.id_feria = fe.id_feria
      WHERE fe.id_feria = $1;
    `;

    const result = await pool.query(query, [id_feria]);

    if (result.rows.length === 0) {
      console.log('No se encontraron fechas de contratos para la feria con id_feria:', id_feria);
      return res.status(404).json({ message: 'No se encontraron fechas de contratos para la feria proporcionada.' });
    }

    console.log('Fechas de contratos obtenidas exitosamente:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener las fechas de contratos:', error);
    res.status(500).json({ message: 'Error al obtener las fechas de contratos.' });
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
  aceptarPostulacion,
  obtenerHorario,
  obtenerFechasContratos
};
