
// TRAE LA FERIA , PROGRAMACION DE LA FERIA Y LA UBICACION


// Función para obtener ferias con paginación
const getFeriasPaginado = async (pool,limit, offset,idComuna,idRegion) => {
  const result = await pool.query('SELECT * FROM obtener_ferias_paginado($1, $2, $3, $4)', [limit, offset,idRegion,idComuna]);
  return result.rows;
};

// Función para obtener horarios de un grupo de ferias
const getHorariosFerias = async (feriasIds,pool) => {
  const result = await pool.query('SELECT * FROM obtener_horarios_ferias_feedFerias($1)', [feriasIds]);
  return result.rows;
};

const getActividadesFeria = async (horariosIds,pool) => {
  const result = await pool.query('SELECT * FROM obtener_actividades_feria($1)', [horariosIds]);
  return result.rows;
};

const get_feria = async (res , pool, limit , offset , idComuna, idRegion) => {

  try {
    // 1. Obtiene las ferias paginadas
    const ferias = await getFeriasPaginado(pool,limit, offset,idComuna,idRegion);
    
    // 2. Obtiene los IDs de las ferias para la página actual y llama los horarios para esos ids
    const feriasIds = ferias.map(feria => feria.id_feria);
    
    const horarios = await getHorariosFerias(feriasIds,pool);

    // 3. Obtiene los IDs de las horarios de las ferias para la página actual y llama las actividades de las ferias para esos ids
    const actividadesFeria = await getActividadesFeria(feriasIds, pool)
        // 4. Combina las ferias con sus horarios y sus actividades
      // Crear índices para horarios y actividades
    const horariosIndex = horarios.reduce((acc, horario) => {
      if (!acc[horario.id_feria]) acc[horario.id_feria] = [];
      acc[horario.id_feria].push(horario);
      return acc;
    }, {});

    const actividadesIndex = actividadesFeria.reduce((acc, actividad) => {
      if (!acc[actividad.id_feria]) acc[actividad.id_feria] = [];
      acc[actividad.id_feria].push(actividad);
      return acc;
    }, {});

    // Mapear ferias con horarios y actividades
    const feriasConHorarios = ferias.map(feria => ({
      ...feria,
      horarios: horariosIndex[feria.id_feria] || [],  // Evitar undefined si no hay horarios
      actividades: actividadesIndex[feria.id_feria] || []  // Evitar undefined si no hay actividades
    }));


    res.json(feriasConHorarios);
  } catch (error) {
    console.error('Error al obtener ferias:', error);
    res.status(500).json({ error: 'Error al obtener ferias' });
  }

  };


const get_puestos_feria = async (req, res, pool) => {

try{
const resutl = await pool.query( 'SELECT * FROM traer_puestos_feria($1)' , [id_feria])
res.json(resutl.rows)

}catch (err){

    console.error('Error al obtener los puestos de la feria:', err);
    res.status(500).send('Error al obtener los puestos');

}
    
}


const get_puestos_actividad = async (res, pool,nombre_feria , date) => {

try{
const resutl = await pool.query( `
  SELECT * FROM obtener_puestos_actividad($1, $2)` , [nombre_feria , date])
res.json(resutl.rows)

}catch (err){

  console.error('Error al obtener los puestos de la feria:', err);
  res.status(500).send('Error al obtener los puestos');

}
  
}




module.exports = { get_feria ,get_puestos_feria ,get_puestos_actividad};