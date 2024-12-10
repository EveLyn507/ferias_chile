const obtenerEstadoFeria = async (req, res, pool) => {
  const { id_feria } = req.query;


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
const getPuestos = async ( res, pool, id_feria , fecha) => {
  try {
    const puestos = await pool.query(`
      SELECT p.id_puesto, p.numero, ep.estado
      FROM feria f
      JOIN puesto p ON (p.id_feria = f.id_feria)
      JOIN estado_puesto ep ON p.id_estado_puesto = ep.id_estado_puesto
      WHERE f.id_feria = $1  
      order by p.id_puesto;`,
      [id_feria] // Pasar la fecha como segundo parámetro
    );


    res.status(200).json(puestos.rows);
  } catch (error) {
    console.error('Error al obtener puestos:', error.message);
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
  const  { id_feria , fecha} = req.params;


  // Validar que id_feria es un número válido
  if (!id_feria || isNaN(id_feria)) {
    console.log('Error: id_feria no es un número válido');
    return res.status(400).json({ message: 'El id_feria debe ser un número válido' });
  }

  try {
    const query = `
SELECT 
  cp.id_user_fte, 
  (
    SELECT fte.nombre||' '|| fte.apellido
    from feriante fte WHERE fte.id_user_fte = cp.id_user_fte
  ) as nombre_feriante,
  p.id_puesto, 
  p.numero, 
  p.precio ,
  ec.detalle as estado_pago,
  cp.id_estado_contrato,
  tp.detalle as tipo_pago
  FROM feria  f
  JOIN detalle_programa_feria  dpf ON dpf.id_feria = f.id_feria
  JOIN actividad_feria af ON af.id_horario_feria = dpf.id_horario_feria 
  JOIN arriendo_puesto ap ON ap.id_actividad_feria = af.id_actividad_feria
  JOIN puesto p ON p.id_puesto = ap.id_puesto
  JOIN contrato_puesto cp ON cp.id_arriendo_puesto = ap.id_arriendo_puesto
  JOIN tipo_pago tp ON tp.id_tipo_pago = cp.id_tipo_pago
  JOIN estado_contrato ec ON ec.id_estado_contrato = cp.id_estado_contrato
  WHERE f.id_feria = $1 AND af.fecha =  $2;
    `;


    // Pasamos id_feria como parámetro
    const result = await pool.query(query, [parseInt(id_feria, 10) , fecha]);

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

const getPuestosDisponibles = async (res, pool, id_feria , fecha) => {
  console.log('activelacadfasfjksdnfguhsdnflks');
  
  try {
    const result  = await pool.query( `
      SELECT distinct p.id_puesto, p.numero, p.descripcion, p.precio, a.id_arriendo_puesto
      FROM puesto p
      JOIN arriendo_puesto a ON (a.id_puesto = p.id_puesto)
	    JOIN actividad_feria af ON af.id_actividad_feria = a.id_actividad_feria
      JOIN feria f ON (p.id_feria = f.id_feria)
      JOIN estado_puesto e ON (p.id_estado_puesto = e.id_estado_puesto)
      WHERE e.id_estado_puesto = 1 AND f.id_feria = $1 AND a.id_estado_arriendo = 1 AND af.fecha = $2`, [id_feria, fecha]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener el estado de la feria:', error);
    res.status(500).json({ message: 'Error al obtener el estado de la feria' });
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


const getFechasDisponibles = async (req, res, pool) => {
  let { id_feria } = req.params;

  // Validar que id_feria sea un número válido
  if (!id_feria || isNaN(parseInt(id_feria, 10))) {
    return res.status(400).json({ message: 'El id_feria debe ser un número válido' });
  }

  id_feria = parseInt(id_feria, 10);

  try {
    const query = `
        select distinct  a.fecha
      from feria f
      join detalle_programa_feria d
      on (d.id_feria = f.id_feria)
      join actividad_feria a
      on (a.id_horario_feria = d.id_horario_feria)
	    join arriendo_puesto ar
	    on(a.id_actividad_feria = ar.id_actividad_feria)
      where f.id_feria = $1`;

    const result = await pool.query(query, [id_feria]);



    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las fechas de MAPAS' });
  }
};

// Insertar contrato para un puesto específico
const createContrato = async (res , pool , id_arriendo_puesto , nombre_fisico, precio) => {
  const timestamp = new Date().getTime();
  const sessionId = `session--${timestamp}`;
  const buyOrder = `order--${timestamp}`;
  const timestampUTC = new Date().toISOString(); 
  try {


    const arriendo  = await pool.query(`
      UPDATE arriendo_puesto 
      SET id_estado_arriendo = 3
      WHERE id_arriendo_puesto = $1
      RETURNING * `, [id_arriendo_puesto])


    // Insertar en la tabla arriendo_puesto

    if (arriendo.rows.length > 0) {
      // Insertar en la tabla contrato_puesto con el id_arriendo_puesto obtenido
      const contrato =  await pool.query(`
        INSERT INTO contrato_puesto 
        (id_user_fte , usuario_fisico , fecha_pago, id_arriendo_puesto, id_tipo_pago, id_estado_contrato , precio , buy_order , session_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8 , $9) 
        RETURNING id_arriendo_puesto
      ` , [null,nombre_fisico, timestampUTC ,id_arriendo_puesto, 3, 5, precio, buyOrder, sessionId]) 
        res.status(200).json({msj: "contrato exitoso"})

    }
  } catch (error) {
    console.error('Error en la creación del contrato o arriendo del puesto:', error);
    res.status(500).json({ error: 'Error en la creación del contrato o arriendo del puesto' });
  }
  }



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
  getFechasDisponibles,
  getPuestosDisponibles,
  createContrato,
};
