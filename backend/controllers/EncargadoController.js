
// FUNCIONES PERFIL 

const req = require("express/lib/request");


const getHorariosParaFerias = async (feriasIds,pool) => {
  const result = await pool.query('SELECT * FROM obtener_horarios_para_ferias($1)', [feriasIds]);
  return result.rows;
};


// Obtener ferias del encargado con horarios
const get_feria_Encargado = async (req, res, pool) => {
  const { mail } = req.body;
  
  try {
    // 1. Obtiene las ferias del encargado
    const ferias = await pool.query(`SELECT * FROM obtener_ferias_encargado($1);`, [mail]);
    
    // Verifica si hay ferias
    if (ferias.rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron ferias para el encargado." });
    }

    // 2. Obtiene los IDs de las ferias para la página actual
    const feriasIds = ferias.rows.map(feria => feria.id_feria);
    
    // 3. Obtiene los horarios solo para esas ferias
    const horarios = await getHorariosParaFerias(feriasIds, pool);

    // 4. Combina las ferias con sus horarios
    const feriasConHorarios = ferias.rows.map(feria => {
      const horariosFeria = horarios.filter(horario => horario.id_feria === feria.id_feria);
      return {
        ...feria,
        horarios: horariosFeria
      };
    });

    // 5. Envía las ferias con sus horarios combinados
    res.json(feriasConHorarios);

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






const saveProgramacionFeria = async (req, res, pool) => {
  const { id_feria, programacion } = req.body; // Extrae la programación desde el body

  try {
    for (const programa of programacion) {
      const { dia, hora_inicio, hora_termino, dia_armado, hora_inicio_armado, hora_termino_armado } = programa;

      // Verificar si ya existe un registro para el id_feria y el día específico
      const existingResult = await pool.query(
        `SELECT * FROM detalle_programa_feria WHERE id_feria = $1 AND dia = $2;`,
        [id_feria, dia]
      );

      if (existingResult.rows.length > 0) {
        // Si existe, hacer un UPDATE
        await pool.query(
          `UPDATE detalle_programa_feria
           SET hora_inicio = $3,
               hora_termino = $4,
               dia_armado = $5,
               hora_inicio_armado = $6,
               hora_termino_armado = $7
           WHERE id_feria = $1 AND dia = $2;`,
          [id_feria, dia, hora_inicio, hora_termino, dia_armado, hora_inicio_armado, hora_termino_armado]
        );
      } else {
        // Si no existe, hacer un INSERT
        await pool.query(
          `INSERT INTO detalle_programa_feria (id_feria, id_estado_programa,dia, dia_inicio_fecha,hora_inicio, hora_termino, dia_armado, hora_inicio_armado, hora_termino_armado)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
          [id_feria, 1,dia, '20/10/2024',hora_inicio, hora_termino, dia_armado, hora_inicio_armado, hora_termino_armado]
        );
      }
    }

    return res.status(200).json({ message: 'Programación de Feria guardada correctamente' });
  } catch (err) {
    console.log('Error al insertar o actualizar la programación', err);
    return res.status(500).json({ message: 'Error al insertar o actualizar la programación de la feria', error: err.message });
  }
};



const getPrograma = async (req , res , pool) => {

    const id_feria = parseInt(req.params.id_feria, 10);

try{
  const result = await pool.query(`
    SELECT *
    FROM detalle_programa_feria 
    WHERE id_feria = $1`,[id_feria])


  res.json(result.rows)

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

/////// FORMULARIO CREACION DE FERIA

const createFeria = async (req, res) => {
  const { nombre, id_comuna, encargado_mail, id_region, id_estado, mail_banco } = req.body;
  const pool = req.pool;

  try {
      // Insertar el registro en la tabla feria
      const result = await pool.query(
          `INSERT INTO feria (nombre, id_comuna, encargado_mail, id_region, id_estado, mail_banco)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [nombre, id_comuna, encargado_mail, id_region, id_estado, mail_banco]
      );

      res.status(201).json(result.rows[0]);  // Devolver el registro insertado
  } catch (error) {
      console.error('Error al insertar en feria:', error);
      res.status(500).json({ error: 'Error al insertar en feria' });
  }
};

module.exports = {
  createFeria,
};
module.exports = {
  saveFeria,
  getFeria,
  get_feria_Encargado,
  abrirTiketFeria,
  saveProgramacionFeria,
  getPrograma,
  saveDatosBank,
  getDatosBank,
  deleteBank,
  createFeria
};