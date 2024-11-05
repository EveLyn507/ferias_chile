
  //PERFIL MUNICIPAL -- VISTA PRINCIPAL

  const obtenerSolicitudes = async ( res, pool,id_user_adm) => {
  try {
  const result = await pool.query(
     ` SELECT * FROM solicitudes_apertura where id_user_adm = $1;` , [id_user_adm]);
  res.json(result.rows)
  
  }catch (err){
      console.error('Error al obtener las solicitudes del admin:', err);
      res.status(500).send('Error al obtener las solicitudes del admin');
  
  }
  
  }


const confirmSoli = async ( res, pool,idFeria) => {
  try {
  const result = await pool.query(
      ` UPDATE solicitudes_apertura
      SET id_estado = 2
      WHERE id_solicitud = $1` , [id_solicitud]);


      await pool.query(`
        UPDATE feria
        SET id_estado = 4
        WHERE id_feria = $1`, [idFeria])

  res.status(200).json({msj : 'feria confirmada exitosamente'})
  
  }catch (err){
      console.error('Error al confirmar feria:', err);
      res.status(500).send('Error al confirmar feria');
  
  }
  
  }

const declineSoli = async ( res, pool) => {
  try {
  const result = await pool.query(
      ` SELECT * FROM solicitudes_apertura where admin_muni_mail = $1;` , [id_user_adm]);
  res.json(result.rows)
  
  }catch (err){
      console.error('Error al obtener las ferias:', err);
      res.status(500).send('Error al obtener las ferias');
  
  }
  
  }


module.exports = {obtenerSolicitudes ,confirmSoli ,declineSoli}