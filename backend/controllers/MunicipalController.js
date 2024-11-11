
  //PERFIL MUNICIPAL -- VISTA PRINCIPAL

  const obtenerSolicitudes = async ( res, pool,id_user_adm) => {
  try {
  const result = await pool.query(
     `SELECT 
      sa.id_solicitud,
      sa.id_estado,
      es.estado,
      f.id_feria,
      f.nombre as nombre_feria,
      sa.id_user_adm, 
      CONCAT(enf.nombre,' ',enf.apellido) as nombre_solicitante,
      enf.user_mail as enf_mail,
      enf.telefono as enf_fono
      FROM solicitudes_apertura sa 
      JOIN estado_solicitud es ON sa.id_estado = es.id_estado
      JOIN feria f ON f.id_feria = sa.id_feria
      JOIN encargado_feria enf ON enf.id_user_enf = f.id_user_enf
      where sa.id_user_adm = $1 AND sa.id_estado = 1`  , [id_user_adm]);
  res.json(result.rows)
  
  }catch (err){
      console.error('Error al obtener las solicitudes del admin:', err);
      res.status(500).send('Error al obtener las solicitudes del admin');
  
  }
  
  }


const confirmSoli = async ( res, pool,id_feria,id_solicitud) => {
  
  try {
      await pool.query(
      ` UPDATE solicitudes_apertura
      SET id_estado = 2
      WHERE id_solicitud = $1` , [id_solicitud]);


      await pool.query(`
        UPDATE feria
        SET id_estado = 4
        WHERE id_feria = $1`, [id_feria])

  res.status(200).json({msj : 'feria confirmada exitosamente'})
  
  }catch (err){
      console.error('Error al confirmar feria:', err);
      res.status(500).send('Error al confirmar feria');
  
  }
  
  }

const declineSoli = async ( res, pool,id_feria,id_solicitud) => {
  try {
    await pool.query(
    `UPDATE solicitudes_apertura
    SET id_estado = 3
    WHERE id_solicitud = $1` , [id_solicitud]);


    await pool.query(`
      UPDATE feria
      SET id_estado = 3
      WHERE id_feria = $1`, [id_feria])

res.status(200).json({msj : 'feria confirmada exitosamente'})

}catch (err){
    console.error('Error al confirmar feria:', err);
    res.status(500).send('Error al confirmar feria');

}
  
  }


module.exports = {obtenerSolicitudes ,confirmSoli ,declineSoli}