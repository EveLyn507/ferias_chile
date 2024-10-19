
// TRAE LA FERIA , PROGRAMACION DE LA FERIA Y LA UBICACION
const get_feria = async (req , res , pool) => {
    try {
      const result = await pool.query('SELECT * FROM obtener_ferias();');
  
      // Mapea los resultados para transformar la programación a una lista
      const ferias = result.rows.map(feria => {
        // Crea la lista de programación a partir de los valores de los días
        const programa = [{
          lunes: feria.lunes,
          martes: feria.martes,
          miercoles: feria.miercoles,
          jueves: feria.jueves,
          viernes: feria.viernes,
          sabado: feria.sabado,
          domingo: feria.domingo
        }];
  
        return {
          id_feria: feria.id_feria,
          nombre_feria: feria.nombre_feria,
          comuna: feria.comuna,
          region: feria.region,
          programa: programa // Aquí asignas la programación en formato de lista
        };
      });
  
      res.json(ferias)// Devuelve el array de ferias transformadas
    } catch (err) {
      console.error('Error al obtener ferias', err);
      throw err; // Maneja el error según tus necesidades
    }
  };


const get_puestos_feria = async (req, res, pool) => {
    const id_feria = parseInt(req.params.id_feria, 10); // Convertir a entero

try{
const resutl = await pool.query( 'SELECT * FROM public.traer_puestos_feria($1)' , [id_feria])
res.json(resutl.rows)

}catch (err){

    console.error('Error al obtener los puestos de la feria:', err);
    res.status(500).send('Error al obtener los puestos');

}
    
}




module.exports = { get_feria ,get_puestos_feria};