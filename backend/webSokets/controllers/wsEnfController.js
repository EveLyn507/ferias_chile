
async function UpdatePuesto(socket , pool , PlanoItemElement) {
console.log(PlanoItemElement);

  const {id_elemento , nombre_elemento, dimenciones , style , dataPuesto, id_puesto} = PlanoItemElement.params

  try {
    const result = await pool.query(`
      UPDATE  elemento_plano 
      SET nombre_elemento = $2 , dimenciones =  $3 , style = $4 
      WHERE id_elemento = $1` , [id_elemento , nombre_elemento, dimenciones , style ]
    )
    if (dataPuesto) {
      const {descripcion, id_tipo_puesto, precio } = dataPuesto

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


module.exports = { UpdatePuesto };
