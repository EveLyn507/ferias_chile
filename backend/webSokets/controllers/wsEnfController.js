


async function UpdatePuesto(socket , pool , PlanoItemElement) {

  const {id_elemento , nombre_elemento, dimenciones , style , dataPuesto} = PlanoItemElement.params

  try {
    const result = await pool.query(`
      UPDATE  elemento_plano 
      SET nombre_elemento = $2 , dimenciones =  $3 , style = $4 
      WHERE id_elemento = $1` , [id_elemento , nombre_elemento, dimenciones , style ]
    )
    if (dataPuesto) {
      const {id_puesto,descripcion, id_tipo_puesto, precio } = dataPuesto
      const savePuesto = await pool.query(` 
        UPDATE puesto 
        SET descripcion = $2 , id_tipo_puesto = $3 , precio = $4
        WHERE id_puesto = $1`, [id_puesto,descripcion, id_tipo_puesto, precio])
        
    }

    console.log('data actualizadaaaaaaaaaaaaa');
    
    socket.emit('datos actualizados', result.rows); // Enviar datos solo al cliente que hizo la solicitud
  } catch (error) {
    console.error('Error en la consulta:', error);
    socket.emit('error', 'Error al obtener los datos');
  }
}



const CreatePuesto = async (pool , newItem) => {
  const item = newItem.params

  const {id_plano , nombre_elemento, id_tipo_elemento ,id_feria} = item
  const dimenciones = item.dimenciones
  const style = item.style

  console.log('id_feriaaaa ' ,id_feria);
  
  try {

    const cantPuestos = await pool.query(`select contar_puestos_actuales($1)`, [id_feria])
      const numPuesto = await cantPuestos.rows[0].contar_puestos_actuales + 1
      
      const puesto = await pool.query(`
        INSERT INTO puesto (id_tipo_puesto, numero,descripcion,id_feria)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        ` , [null ,numPuesto , 'Vacio' , id_feria])
        const id_puestoo = puesto.rows[0].id_puesto

       const dim = await pool.query(`
        INSERT INTO elemento_plano (id_plano , nombre_elemento ,id_tipo_elemento , dimenciones , style , id_puesto) 
        VALUES ($1,$2,$3,$4,$5,$6) 
        RETURNING *`,[id_plano,nombre_elemento,id_tipo_elemento , dimenciones, style, id_puestoo])
        
      
        const final = dim.rows[0] 
        const data = {
          id_feria : id_feria,
          id_elemento : final.id_elemento,
          id_plano : final.id_plano,
          nombre_elemento : final.nombre_elemento,
          id_tipo_elemento: final.id_tipo_elemento,
          dimenciones : final.dimenciones,
          stile : final.style,
          id_puesto: final.id_puesto,
          dataPuesto: puesto.rows[0]
        }

     
        return data
  } catch (error) {
    console.log('error al crear el puesto', error);
    
  }
}

const createCalle = async (pool , newItem) => {
  const item = newItem.params

  const {id_plano , nombre_elemento, id_tipo_elemento , id_feria } = item
  const dimenciones = item.dimenciones
  const style = item.style


  try {

       const dim = await pool.query(`
        INSERT INTO elemento_plano (id_plano , nombre_elemento ,id_tipo_elemento , dimenciones , style , id_puesto) 
        VALUES ($1,$2,$3,$4,$5,$6) 
        RETURNING *`,[id_plano,nombre_elemento,id_tipo_elemento , dimenciones, style, null])

        const final = dim.rows[0] 
        const data = {
          id_feria : id_feria,
          id_elemento : final.id_elemento,
          id_plano : final.id_plano,
          nombre_elemento : final.nombre_elemento,
          id_tipo_elemento: final.id_tipo_elemento,
          dimenciones : final.dimenciones,
          stile : final.style,
          id_puesto: final.id_puesto,
          dataPuesto: null
        }

        return data

} catch (error) {
  console.log('error al crear el puesto', error);
  
 }
}
 
//guarda un nuevo item del plano
const CreateNewItemElement = async (socket, pool , newItem ) => {
const { id_tipo_elemento } = newItem.params

try { 
    //crea puesto
    if(id_tipo_elemento === 1) {
      const data = await CreatePuesto(pool , newItem)
      socket.emit('ItemCreated', data); // Enviar datos solo al cliente que hizo la solicitud

    }
    //creacalle
    else if(id_tipo_elemento === 2) {
      const data = await createCalle(pool , newItem)
      socket.emit('ItemCreated', data); // Enviar datos solo al cliente que hizo la solicitud
    }else{
      socket.emit('ItemCreated', 'Item invalido');
    }
          
} catch (error) {
  console.log('error al ingresar puesto' , error);
  socket.emit('ItemCreated', 'error al ingresar el nuevo item');
  
 }
    
}


const UpdatePlano = async (socket , pool , newDimencions) => {

  const {id_feria , width , height } = newDimencions.params
  try {
    const result = await pool.query(`
      UPDATE plano 
      set width = $2 , height = $3
      WHERE id_feria = $1` , [id_feria , width , height ])
    
      
      socket.emit('UpdatedPlano', 'Plano actualizado');
  } catch (error) {
    socket.emit('UpdatedPlano', 'Error al actualizar plano');
  }

}



const DeleteItemPlano = async (socket , pool, id_delete) => {

    const {id_elemento ,id_tipo_elemento ,nombre_elemento, id_plano, id_puesto ,id_feria} = id_delete.params
      
      
  try {
    if(id_tipo_elemento === 1) {
       await pool.query(`
        DELETE FROM elemento_plano 
        WHERE id_elemento = $1 and id_plano = $2`,[id_elemento, id_plano])
      
        
        await pool.query(`
          DELETE FROM puesto 
          WHERE id_puesto = $1 and id_feria = $2`, [id_puesto , id_feria])
          socket.emit('DeleteItem' , 'elemento eliminado correctamente' ,nombre_elemento )
    }else if (id_tipo_elemento === 2) {
       await pool.query(`
        DELETE FROM elemento_plano 
        WHERE id_elemento = $1 and id_plano = $2`, [id_elemento, id_plano])
      
        socket.emit('DeleteItem' , 'elemento eliminado correctamente' ,nombre_elemento )

    }
       
  } catch (error) {
    socket.emit('DeleteItem' , 'ERROR al eliminar elemento' ,nombre_elemento )
  }
}



module.exports = { UpdatePuesto , CreateNewItemElement,UpdatePlano,DeleteItemPlano };
