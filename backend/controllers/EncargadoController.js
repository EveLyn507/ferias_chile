
// FUNCIONES PERFIL 

const req = require("express/lib/request");

// get id_feria nombre nombre_region nombre_comuna
const get_feria_Encargado = async (req, res, pool) => {
  const { mail } = req.body;
  
  try {
    const result = await pool.query(`SELECT * FROM obtener_ferias_encargado($1);`, [mail]);

    // Procesar cada fila para incluir la programación como un objeto en una lista
    const feriasConProgramacion = result.rows.map((feria) => {
      // Crear un objeto para los días de la semana
      const programa = [{
        lunes: feria.progra_lunes,
        martes: feria.progra_martes,
        miercoles: feria.progra_miercoles,
        jueves: feria.progra_jueves,
        viernes: feria.progra_viernes,
        sabado: feria.progra_sabado,
        domingo: feria.progra_domingo
      }];

      // Retornar el objeto de la feria con la programación en formato de lista
      return {
        id_feria: feria.id_feria,
        nombre_feria: feria.nombre_feria,
        comuna: feria.comuna,
        region: feria.region,
        estado: feria.estado,
        puestos_actuales: feria.puestos_actuales,
        programa: programa  // Aquí asignas la programación en formato de lista
      };
    });

    // Enviar la respuesta con los datos procesados
    res.json(feriasConProgramacion);

  } catch (err) {
    console.error('Error al obtener las ferias:', err);
    res.status(500).send('Error al obtener las ferias');
  }
};


const abrirTiketFeria = async (req, res, pool) => {
  const {id_feria , mail} = req.body;
  const admin = '3@3';
try {

const result = await pool.query(
  'SELECT insertar_solicitud_apertura($1,$2,$3);' , [mail,admin,id_feria]);
res.json(result.rows)

}catch (err){
    console.error('Error al abrir tiket:', err);
    res.status(500).send('Error al  abrir tiket');

  }

}


//HERRAMIENTA DE PLANOS
// Controlador para guardar la feria
const saveFeria = async (req, res) => {
  const { puestos, areas, calles, planWidth, planHeight, id_feria } = req.body; // Incluye id_feria en la desestructuración
  const pool = req.pool;

  try {
    // Verificar si ya existe un registro con ese id_feria
    const existingFeria = await pool.query('SELECT * FROM json_feria WHERE id_feria = $1', [id_feria]);

    const nombre_json = {
      puestos,
      areas,
      calles,
      planWidth, 
      planHeight
    };
    if (existingFeria.rows.length > 0) {
      // Actualizar el registro existente
      await pool.query('UPDATE json_feria SET nombre_json = $1 WHERE id_feria = $2', [JSON.stringify(nombre_json), id_feria]);
      return res.status(200).json({ message: 'Feria actualizada correctamente' });
    } else {
      // Insertar un nuevo registro
      const queryText = `
        INSERT INTO json_feria (nombre_json, id_feria)
        VALUES ($1, $2)
        RETURNING id_json
      `;
      const result = await pool.query(queryText, [JSON.stringify(nombre_json), id_feria]);
      return res.status(201).json({ id_feria: result.rows[0].id_json });
    }
  } catch (error) {
    console.error('Error al guardar la feria:', error);
    res.status(500).json({ error: 'Error al guardar la feria' });
  }
};


// cargar el json  de la feria a la app
const getFeria = async (req, res) => {
  const pool = req.pool;
  const id_feria = parseInt(req.params.id_feria, 10);
  try {
    const result = await pool.query('SELECT nombre_json FROM json_feria WHERE id_feria = $1', [id_feria]);
    if (result.rows.length > 0) {
      res.json(result.rows[0].nombre_json);
    } else {
      res.status(404).json({ error: 'Feria no encontrada' });
    }
  } catch (err) {
    console.error('Error al obtener la feria:', err);
    res.status(500).json({ error: 'Error al obtener la feria' });
  }
};







// ADMINISTRACION DE LA FERIA
const saveProgramacionFeria = async (req, res, pool) => {
  const { id_feria, programacion } = req.body;
  const { lunes, martes, miercoles, jueves, viernes, sabado, domingo } = programacion;

  try {
    // Verificar si ya existe un registro para el id_feria
    const existingResult = await pool.query(
      `SELECT * FROM programa_feria WHERE id_feria = $1;`,
      [id_feria]
    );

    if (existingResult.rows.length > 0) {
      // Si existe, hacer un UPDATE
      await pool.query(
        `UPDATE programa_feria
         SET lunes = $1, martes = $2, miercoles = $3, jueves = $4, viernes = $5, sabado = $6, domingo = $7
         WHERE id_feria = $8;`,
        [lunes, martes, miercoles, jueves, viernes, sabado, domingo, id_feria]
      );
      return res.status(200).json({ message: 'Programación de Feria actualizada correctamente' });
    } else {
      // Si no existe, hacer un INSERT
      await pool.query(
        `INSERT INTO programa_feria (id_feria, lunes, martes, miercoles, jueves, viernes, sabado, domingo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
        [id_feria, lunes, martes, miercoles, jueves, viernes, sabado, domingo]
      );
      return res.status(200).json({ message: 'Programación de Feria insertada correctamente' });
    }
  } catch (err) {
    console.log('Error al insertar o actualizar la programación', err);
    return res.status(500).json({ message: 'Error al insertar o actualizar la programación de la feria', error: err.message });
  }
};

const getPrograma = async (req , res , pool) => {

    const id_feria = parseInt(req.params.id_feria, 10);
try{
  const result = await pool.query(`
    SELECT lunes, martes, miercoles, jueves, viernes, sabado, domingo 
    FROM programa_feria 
    WHERE id_feria = $1`,[id_feria])


  res.json(result.rows[0])

}catch (err){
  console.error('Error al obtener la feria:', err);
  res.status(500).json({ error: 'Error al obtener la feria' });

  }
}


const saveDatosBank = async (req , res ,pool ) => {

  const {mail_banco, nombre_asociado, numero_cuenta, encargado_mail} = req.body.encargadoBank
  try {
    

    const result = await pool.query (`
    INSERT INTO banco_encargado (mail_banco, nombre_asociado, numero_cuenta, encargado_mail)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (mail_banco)
    DO UPDATE
    SET 
    nombre_asociado = EXCLUDED.nombre_asociado,
    numero_cuenta = EXCLUDED.numero_cuenta,
    encargado_mail = EXCLUDED.encargado_mail
  
    
  ` , [mail_banco, nombre_asociado, numero_cuenta, encargado_mail])
  
  return res.status(200);
  }catch (err){
    console.log('error al iinsertar banco ' ,err)
    res.status(500).json({ error: 'Error al guardar banco' });
  }


}


const getDatosBank = async (req , res , pool) => {
const {mail} = req.body

try{
  const result = await pool.query (`
    SELECT mail_banco, nombre_asociado, numero_cuenta, encargado_mail
    FROM banco_encargado 
    WHERE encargado_mail = $1;`, [mail])
    
    if (result.rows != undefined) {
      res.json(result.rows)
 
    }else {
      res.status(500).json({ error: 'Error al obtener datos del  banco o no existen' });
 
    }

 

}catch(err){ 

  console.log('error al iinsertar banco ' ,err)
}


}

const deleteBank = async (req,res, pool) => {

 const  {mail_banco} = req.body
 
try{
  await pool.query(` 
    DELETE FROM banco_encargado 
    WHERE mail_banco = $1 `, [mail_banco]) 
    res.status(200).json({message : 'borrado correctamente'})
}catch (err){

  console.log('error al borrar banco ' ,err)
  }
}




module.exports = {
  saveFeria,
  getFeria,
  get_feria_Encargado,
  abrirTiketFeria,
  saveProgramacionFeria,
  getPrograma,
  saveDatosBank,
  getDatosBank,
  deleteBank
};