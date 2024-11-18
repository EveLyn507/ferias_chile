
// cargar el json  de la feria a la app
const FeriaElements = async (pool ,id_feria) => {

    try {
      const plano = await pool.query(`
        SELECT * from plano where id_feria = $1`, [id_feria])

      const id_plano = plano.rows[0].id_plano // extraer el id_plano 

      const planoElements = await pool.query('SELECT * FROM get_plano_elements($1)', [id_plano]);
  
      const planoData = {
        plano : plano.rows[0],
        elements: planoElements.rows
      }
     return planoData
  
    } catch (err) {
      console.error('Error al obtener la feria:', err);
      return null
    }
  };
  

  const get_puestos_actividad = async ( pool,nombre_feria , date) => {

 
    try{
    const resutl = await pool.query( `
      SELECT * FROM obtener_puestos_actividad($1, $2)` , [nombre_feria , date])
   return resutl.rows
    }catch (err){
    
      console.error('Error al obtener los puestos de la feria:', err);
      return null
    
    }
}    


const getArriendosFToday = async (socket , pool, params) => {
    const {idFeria , nombre_feria, fecha} = params.params

    if(idFeria === null  || nombre_feria === null || fecha === null) {
        socket.emit('ResponceTodayFeriaElements' , 'error , falta un dato para la busqueda')
        return
    }

    const planoData = await FeriaElements(pool, idFeria)

    if(planoData) {
      try {
        const todayArriendos = await get_puestos_actividad(pool, nombre_feria, fecha)
        const todayData = {
            planoData : planoData,
            todayArriendos: todayArriendos
        }
      
        
        
        socket.emit('ResponceTodayFeriaElements' , todayData)

      } catch (error) {
        socket.emit('ResponceTodayFeriaElements' , 'Error al cargar los datos')
      }
   
    }else {
        socket.emit('ResponceTodayFeriaElements' , 'Error al cargar los datos')
    }

}



  module.exports = { getArriendosFToday}