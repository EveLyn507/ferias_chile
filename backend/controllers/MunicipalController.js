
  //PERFIL MUNICIPAL -- VISTA PRINCIPAL

  const obtenerSolicitudes = async (req, res, pool) => {

    const {mail} = req.body;
  try {
  
  const result = await pool.query(
     ` SELECT * FROM solicitudes_apertura where admin_muni_mail = $1;` , [mail]);
  res.json(result.rows)
  
  }catch (err){
      console.error('Error al obtener las ferias:', err);
      res.status(500).send('Error al obtener las ferias');
  
  }
  
  }


module.exports = {obtenerSolicitudes}