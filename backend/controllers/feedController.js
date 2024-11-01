
// TRAE LA FERIA , PROGRAMACION DE LA FERIA Y LA UBICACION


// Función para obtener ferias con paginación
const getFeriasPaginado = async (limit, offset,pool) => {
  const result = await pool.query('SELECT * FROM obtener_ferias_paginado($1, $2)', [limit, offset]);
  return result.rows;
};

// Función para obtener horarios de un grupo de ferias
const getHorariosFerias = async (feriasIds,pool) => {

  const result = await pool.query('SELECT * FROM obtener_horarios_ferias_feedFerias($1)', [feriasIds]);
  return result.rows;
};

const get_feria = async (req , res , pool) => {
  const { page = 1, limit = 10 } = req.query; // Paginación: página y límite
  const offset = (page - 1) * limit;

  try {
    // 1. Obtiene las ferias paginadas
    const ferias = await getFeriasPaginado(limit, offset,pool);
    
    // 2. Obtiene los IDs de las ferias para la página actual
    const feriasIds = ferias.map(feria => feria.id_feria);
    
    // 3. Obtiene los horarios solo para esas ferias
    const horarios = await getHorariosFerias(feriasIds,pool);

    // 4. Combina las ferias con sus horarios
    const feriasConHorarios = ferias.map(feria => {
      const horariosFeria = horarios.filter(horario => horario.id_feria === feria.id_feria);
      return {
        ...feria,
        horarios: horariosFeria
      };
    });


    res.json(feriasConHorarios);
  } catch (error) {
    console.error('Error al obtener ferias:', error);
    res.status(500).json({ error: 'Error al obtener ferias' });
  }

  };


const get_puestos_feria = async (req, res, pool) => {
    const id_feria = parseInt(req.params.id_feria, 10); // Convertir a entero

try{
const resutl = await pool.query( 'SELECT * FROM traer_puestos_feria($1)' , [id_feria])
res.json(resutl.rows)

}catch (err){

    console.error('Error al obtener los puestos de la feria:', err);
    res.status(500).send('Error al obtener los puestos');

}
    
}




module.exports = { get_feria ,get_puestos_feria};