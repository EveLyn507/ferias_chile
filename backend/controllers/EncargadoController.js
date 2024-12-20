
// FUNCIONES PERFIL 

const { json } = require("body-parser");
const req = require("express/lib/request");


const getHorariosFerias = async (feriasIds,pool) => {
  const result = await pool.query('SELECT * FROM obtener_horarios_ferias_encargado($1)', [feriasIds]);
  return result.rows;
};


// Obtener ferias del encargado +  horarios
const get_feria_Encargado = async (req, res, pool) => {
  const { id_user } = req.body;
  
  try {
    // 1. Obtiene las ferias del encargado
    const ferias = await pool.query(`SELECT * FROM obtener_ferias_encargado($1);`, [id_user]);
    
    // Verifica si hay ferias
    if (ferias.rows.length === 0) {
      return res.status(404);
    }

    // 2. Obtiene los IDs de las ferias para la página actual
    const feriasIds = ferias.rows.map(feria => feria.id_feria);
    
    // 3. Obtiene los horarios solo para esas ferias
    const horarios = await getHorariosFerias(feriasIds, pool);

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

const abrirTiketFeria = async (res, pool, id_feria) => {
  try {
      // Consulta para obtener administradores con la menor carga
      const resultado = await pool.query(`
          WITH carga_solicitudes AS (
              SELECT adm.id_user_adm, COUNT(sa.id_user_adm) AS total_solicitudes
              FROM administrador_municipal adm
              LEFT JOIN solicitudes_apertura sa ON adm.id_user_adm = sa.id_user_adm
              GROUP BY adm.id_user_adm
          ),
          menor_carga AS (
              SELECT id_user_adm
              FROM carga_solicitudes
              WHERE total_solicitudes = (
                  SELECT MIN(total_solicitudes) FROM carga_solicitudes
              )
          )
          SELECT id_user_adm FROM menor_carga;
      `);

      if (resultado.rows.length > 0) {
          // Elegir un administrador aleatorio de la lista
          const randomIndex = Math.floor(Math.random() * resultado.rows.length);
          const id_user_adm = resultado.rows[randomIndex].id_user_adm;

          // Insertar la solicitud
          await pool.query('SELECT insertar_solicitud_apertura($1, $2);', [id_user_adm, id_feria]);
          await pool.query(`
            UPDATE feria 
            SET id_estado = 2
            WHERE id_feria = $1;`, [id_feria])
          res.status(200).json({ msj: 'Apertura exitosa' });
      } else {
          // Asignar a cualquiera si no hay administradores
          const cualquierAdministrador = await pool.query('SELECT id_user_adm FROM administrador_municipal LIMIT 1;');
          if (cualquierAdministrador.rows.length > 0) {
              const id_user_adm = cualquierAdministrador.rows[0].id_user_adm;
              await pool.query('SELECT insertar_solicitud_apertura($1, $2);', [id_user_adm, id_feria]);
              res.status(200).json({ msj: 'Apertura exitosa (asignado a cualquiera)' });
          } else {
              res.status(404).json({ msj: 'No hay administradores disponibles' });
          }
      }
  } catch (err) {
      console.error('Error al abrir tiket:', err);
      res.status(500).send('Error al abrir tiket');
  }
};



//HERRAMIENTA DE PLANOS
// Controlador para guardar la feria
const saveFeria = async (req, res) => {
  const { puestos, areas, calles, planWidth, planHeight, id_feria } = req.body.Updatedpuesto; // Incluye id_feria en la desestructuración
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
const getPlanoElements = async (res, pool ,id_feria) => {

  try {
    const plano = await pool.query(`
      SELECT * from plano where id_feria = $1`, [id_feria])

    const id_plano = plano.rows[0].id_plano // extraer el id_plano 

      
    const planoElements = await pool.query('SELECT * FROM get_plano_elements($1)', [id_plano]);

    const planoData = {
      plano : plano.rows[0],
      elements: planoElements.rows
    }
    res.json(planoData)

  } catch (err) {
    console.error('Error al obtener la feria:', err);
    res.status(500).json({ error: 'Error al obtener los datos del plano' });
  }
};



// INICIO ADMINISTRACION DE LAS FERIASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS

//ADMINISTRACION FERIAS MODULO --> PROGRAMA DE LA FERIA

const getPrograma = async (req , res , pool) => {

  const id_feria = req.params.id_feria

try{
const result = await pool.query(`
SELECT * FROM detalle_programa_feria
WHERE id_feria = $1
ORDER BY id_horario_feria ASC `,[id_feria])
res.json(result.rows)
}catch (err){
console.error('Error al obtener la feria:', err);
res.status(500).json({ error: 'Error al obtener la feria' });

}
}


const UpdateProgramaFeria = async (req, res, pool) => {
  const { id_feria, programa } = req.body; 
  const { id_horario_feria ,hora_inicio, hora_termino, id_dia_armado, hora_inicio_armado, hora_termino_armado, activo } = programa
  try {
      await pool.query(
        `UPDATE detalle_programa_feria
         SET hora_inicio = $3,
             hora_termino = $4,
             id_dia_armado = $5,
             hora_inicio_armado = $6,
             hora_termino_armado = $7,
             activo = $8
         WHERE id_feria = $1 AND id_horario_feria = $2;`,
        [id_feria, id_horario_feria ,hora_inicio, hora_termino, id_dia_armado, hora_inicio_armado, hora_termino_armado, activo]
      );
  
    return res.status(200).json({ message: 'Programación de Feria guardada correctamente' });
    
  } catch (err) {
    console.log('Error al actualizar la programación', err);
    return res.status(500).json({ message: 'Error al actualizar la programación de la feria', error: err.message });
  }
};


// PERFIL ENCARGADO MODULO --> BANCOS
const getDatosBank = async (res , pool,id_user_enf) => {
  try{
    const result = await pool.query (`
      SELECT mail_banco, id_user_enf,nombre_asociado, numero_cuenta
      FROM banco_encargado 
      WHERE id_user_enf = $1;`, [id_user_enf])
      
      if (result.rows != undefined) {
        res.json(result.rows)
   
      }else {
        res.status(500).json({ error: 'Error al obtener datos del  banco o no existen' });
   
      }
    }catch(err){ 
    console.log('error al obtener los bancos ' ,err)
    }
  }

const insertDatosBank = async (res ,pool ,mail_banco, nombre_asociado, numero_cuenta, id_user_enf) => {
  try {
    const check = await pool.query(`
      SELECT * from banco_encargado WHERE mail_banco = $1` ,[mail_banco])
      if(check.length > 0) {
        res.status(409).json({msj: 'este banco ya existe'})
      }else {
        await pool.query (`
          INSERT INTO banco_encargado (mail_banco,id_user_enf, nombre_asociado, numero_cuenta )
          VALUES ($1, $2, $3, $4)
        ` , [mail_banco, id_user_enf,nombre_asociado, numero_cuenta ])
         res.status(200).json({msj : 'exito al agregar banco'});
      }
   
  }catch (err){
    console.log('error al iinsertar banco ' ,err)
    res.status(500).json({ error: 'Error al guardar banco' });
  }
}



const updateDatosBank = async (res ,pool ,mail_banco, nombre_asociado, numero_cuenta, id_user_enf) => {
  try {
    await pool.query (`
 UPDATE banco_encargado
    SET 
    nombre_asociado = $3 , numero_cuenta = $4
    WHERE mail_banco = $1 AND id_user_enf = $2
  ` , [mail_banco, id_user_enf,nombre_asociado, numero_cuenta ])
   res.status(200).json({msj : 'exito al actualizar banco'});
  }catch (err){
    console.log('error al iinsertar banco ' ,err)
    res.status(500).json({ error: 'Error al guardar banco' });
  }
}





const deleteBank = async (res, pool,mail_banco) => {
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
  const { id_user_enf, nombre, id_comuna, mail_banco } = req.body;

  try {
    // Iniciar una transacción
    await req.pool.query('BEGIN');

    const query1 = `
      INSERT INTO feria (id_user_enf, nombre, id_comuna, mail_banco)
      VALUES ($1, $2, $3, $4)
      RETURNING id_feria;
    `;
    const values1 = [id_user_enf, nombre, id_comuna, mail_banco];
    const result1 = await req.pool.query(query1, values1);
    const nuevoIdFeria = result1.rows[0].id_feria; 
 
    await req.pool.query('COMMIT');

    res.status(201).json({
      message: 'Feria creada exitosamente',
      id_feria: nuevoIdFeria,
    });
  } catch (error) {
    await req.pool.query('ROLLBACK');
    console.error('Error al guardar la feria:', error);
    res.status(500).json({
      message: 'Error al guardar la feria',
      error: error.message,
    });
  }
};

const getHorariosVacante = async (idsvacante, pool) =>{

const result = await pool.query(`
  SELECT * FROM detalle_horario_empleado 
  WHERE id_vacante = ANY($1)
  ` , [idsvacante])
  return result.rows;
}

// ADMINISTRACION FERIAS MODULO --> VACANTES DE LA FERIA
const getVacantesFeria = async (res, pool , id_feria) => {
  try {
    const result = await pool.query(` 
      SELECT id_vacante ,id_user_fte, id_rol, id_feria, to_char(ingreso, 'YYYY-MM-DD') as ingreso,to_char(termino, 'YYYY-MM-DD') as termino, id_estado_vacante
      FROM detalle_team_vacante
      WHERE id_feria = $1 AND id_estado_vacante != 3; 
    `, [id_feria]);

      //añade los horarios de la vacante 
      const  vacantes = result.rows
      const vacantesIds = vacantes.map(vacante => vacante.id_vacante);
    
    // 3. Obtiene los horarios solo para esas ferias
    const horarios = await getHorariosVacante(vacantesIds,pool);

    // 4. Combina las ferias con sus horarios
    const vacantesConHorarios = vacantes.map(vacante => {
      const horariosVacante = horarios.filter(horario => horario.id_vacante === vacante.id_vacante);
      return {
        ...vacante,
        horarios: horariosVacante
      };
    });
    res.json(vacantesConHorarios);

  } catch (err) {
    console.log('error al obtener vacantes: ', err);
  }
};


// SAVEHORARIO --> SE INVOCA CUANDO SE GUARDA LA VACANTE
const SaveHorarioVacante = async (id_vacante, id_dia, hora_entrada, hora_salida, pool) => {
  try {
    const result = await pool.query(`
      INSERT INTO detalle_horario_empleado 
      (id_vacante, id_dia, hora_entrada, hora_salida)
      VALUES ($1, $2, $3, $4)
      RETURNING *`, [id_vacante, id_dia, hora_entrada, hora_salida]
    );
    return result.rows[0];  // Retorna el resultado del horario insertado
  } catch (error) {
    console.error('Error al insertar el horario:', error);
    throw error;  // Lanza el error para que sea capturado por la función que llama
  }
};

const insertVacantesFeria = async (res, pool , newVacante) => {
  const { id_user_fte, id_feria, id_rol, ingreso, termino, id_estado_vacante, horarios } = newVacante;
  try {
    // Inserta la vacante y obtiene el id_vacante generado
    const result = await pool.query(
      `INSERT INTO detalle_team_vacante 
      (id_user_fte, id_feria, id_rol, ingreso, termino, id_estado_vacante)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [id_user_fte, id_feria, id_rol, ingreso, termino, id_estado_vacante]
    );

    const { id_vacante } = result.rows[0]; // Extrae el ID de la vacante insertada

    const horariosGuardados = []; // Array para almacenar los horarios guardados

    // Guarda cada horario asociado a la vacante
    await Promise.all(
      horarios.map(async (horario) => {
        const { id_dia, hora_entrada, hora_salida } = horario; // Desestructuración de horario

        const resultHorario = await SaveHorarioVacante(id_vacante, id_dia, hora_entrada, hora_salida, pool); // Llamada a la función asíncrona
        horariosGuardados.push(resultHorario); // Guardar el resultado en la lista de horarios
      })
    );

    // Añade los horarios guardados al objeto de la vacante
    result.rows[0].horarios = horariosGuardados; 

    // Retorna la vacante con su ID y horarios
    res.json(result.rows[0]);  
  } catch (error) {
    console.error('Error al insertar la vacante:', error);
    res.status(500).send('Error al insertar la vacante'); // Respuesta de error
  }
};

const updateHorarioVacante = async (req, res, pool) => {
  const horarios = req.body.horarios;

  try {
    for (const horario of horarios) {
      const { id_detalle_horario, id_dia, hora_entrada, hora_salida } = horario;

      // Ejecutar la consulta para cada horario
      await pool.query(
        `UPDATE detalle_horario_empleado 
         SET id_dia = $1, hora_entrada = $2, hora_salida = $3
         WHERE id_detalle_horario = $4`,
        [id_dia, hora_entrada, hora_salida, id_detalle_horario]
      );
    }
    return res.status(200).json({ msj: 'Horarios actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar la vacante:', error);
    return res.status(500).json({ error: 'Error al actualizar los horarios' });
  }
};

const updateVacanteFeria = async (req, res ,pool) => {
  const { id_vacante, feriante_mail, id_feria, id_rol, ingreso, termino, id_estado_vacante } = req.body.vacante;
  console.log(req.body.vacante)
  try {
     await pool.query(
      `UPDATE detalle_team_vacante 
       SET id_user_fte = $1, id_feria = $2, id_rol = $3, ingreso = $4, termino = $5, id_estado_vacante = $6
       WHERE id_vacante = $7`,
      [feriante_mail, id_feria, id_rol, ingreso, termino, id_estado_vacante, id_vacante]
    );
    return res.status(200).json({msj : 'me actualize'})
  } catch (error) {
    console.error('Error al actualizar la vacante:', error);
    throw error;
  }
};

//borra el horario primero y luego la vacante
const deleteVacante = async (req,res, pool) => {
  const  {id_vacante} = req.body
 try{
   await pool.query(` 
     UPDATE postulaciones 
     set id_estado = 5
     where id_vacante = $1` , [id_vacante])
   await pool.query(` 
    UPDATE detalle_team_vacante
    set id_estado_vacante = 3
     WHERE id_vacante = $1 `, [id_vacante]) 
     res.status(200).json({message : 'vacante marcada como eliminada correctamente'})
 }catch (err){
   console.log('error al borrar vacante ' ,err)
   }
 }

//MODULO POSTULANTES 
const getPostulacionesEnf = async ( res , pool , id_user_enf , id_feria , id_vacante) => {
  try {
    const result = await pool.query(`

      SELECT 
      dtv.id_vacante,
      p.id_postulacion,
      p.id_user_fte,
      fte.nombre ||' '|| fte.apellido  as nombre_postulante
         FROM encargado_feria enf 
         JOIN feria f on  f.id_user_enf = enf.id_user_enf
         JOIN detalle_team_vacante dtv on dtv.id_feria = f.id_feria
         JOIN postulaciones p on p.id_vacante = dtv.id_vacante 
         RIGHT JOIN feriante fte on fte.id_user_fte = p.id_user_fte
         WHERE enf.id_user_enf  = $1  AND f.id_feria = $2 AND dtv.id_vacante = $3 AND p.id_estado = 1;` , [id_user_enf , id_feria , id_vacante]
    );
    res.json(result.rows)  // Retorna el resultado del horario insertado
  } catch (error) {
    console.error('Error al insertar el horario:', error);
    throw error;  // Lanza el error para que sea capturado por la función que llama
  }
};
const rechazarRestoPostulacion = async (pool, id_vacante) => {
  try {
    await pool.query(`
      UPDATE postulaciones
      SET id_estado = 3
      WHERE id_vacante = $1 AND id_estado = 1
    `, [id_vacante]);
  } catch (error) {
    console.error("Error al rechazar el resto de postulaciones:", error);
  }
}



const aceptarPostulacion = async (res, pool, id_postulacion, id_vacante, id_user_fte) => {
  try {
    // Intenta actualizar la vacante y la postulación en una sola consulta si cumple las condiciones
    const result = await pool.query(`
      WITH actualizacion_vacante AS (
        UPDATE detalle_team_vacante
        SET id_user_fte = $1, id_estado_vacante = 2
        WHERE id_vacante = $2 AND id_user_fte IS NULL
        RETURNING id_vacante
      )
      UPDATE postulaciones
      SET id_estado = 2
      WHERE id_postulacion = $3
        AND id_user_fte = $1
        AND id_vacante = $2
        AND id_estado = 1
        AND EXISTS (SELECT 1 FROM actualizacion_vacante)
      RETURNING EXISTS (SELECT 1 FROM actualizacion_vacante) AS actualizado;
    `, [id_user_fte, id_vacante, id_postulacion]);
    
    // Verifica si alguna fila fue actualizada (es decir, la postulación existía y se aceptó)
    if (result.rows[0] && result.rows[0].actualizado) {
      // Llama a la función para rechazar el resto de las postulaciones
      await rechazarRestoPostulacion(pool, id_vacante);
      res.status(200).json({ message: 'Vacante aceptada correctamente' });
    } else {
      res.status(404).json({ msj: 'Solicitud de vacante no encontrada' });
    }
  } catch (err) {
    console.error('Error al aceptar el postulante:', err);
    res.status(500).json({ msj: 'Error interno del servidor' });
  }
};


const rechazarPostulacion = async (res, pool, id_postulacion, id_vacante, id_user_fte) => {
  try {
    // Intentamos actualizar el estado de la postulación en una sola consulta
    const result = await pool.query(`
      UPDATE postulaciones
      SET id_estado = 3
      WHERE id_postulacion = $1 AND id_vacante = $2 AND id_user_fte = $3 AND id_estado = 1
      RETURNING id_postulacion;
    `, [id_postulacion, id_vacante, id_user_fte]);

    // Si se actualizó alguna fila, significa que la postulación existía y fue rechazada
    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Postulación rechazada correctamente' });
    } else {
      res.status(404).json({ msj: 'Solicitud de vacante no encontrada' });
    }
  } catch (err) {
    console.error('Error al rechazar la postulación:', err);
    res.status(500).json({ msj: 'Error interno del servidor' });
  }
};

const recargaStatus = async (res,pool, id_feria) => {

try {
  const resutl = await pool.query( `
    SELECT estado FROM feria f 
    JOIN estado_feria ef ON f.id_estado = ef.id_estado
    WHERE id_feria = $1`, [id_feria])

    res.json(resutl.rows[0])
  
} catch (error) {
  res.status(500).send('error al cargar el estado')

}

}




const getFeriaBank = async (res,pool, id_feria) => {

  try {
    const resutl = await pool.query( `
      SELECT mail_banco FROM FERIA WHERE id_feria = $1`, [id_feria])
  
      res.json(resutl.rows[0])
    
  } catch (error) {
    res.status(500).send('error al cargar el estado')
  
  }
  
  }



const asociarBankFeria = async (res,pool,mail_banco, id_feria) => {
  try {
     await pool.query( `
     UPDATE feria 
     set mail_banco = $1
     WHERE id_feria = $2`, [mail_banco,id_feria])

      res.status(200).json({msj :"feria asociada correctamente al banco"})
    
  } catch (error) {
    res.status(500).send('error al asociar feira ')
  
  }
  
  }


//CAMBIO 
module.exports = {
  saveFeria,getPlanoElements,get_feria_Encargado,//HOME 
  //ADMINISTRACION DE LA FERIA
  abrirTiketFeria,recargaStatus,
  UpdateProgramaFeria,getPrograma, // MODULO PROGRAMACION DE LA FERIA
  insertDatosBank,getDatosBank,updateDatosBank,deleteBank ,getFeriaBank,asociarBankFeria,//MODULO BANCOS
  getVacantesFeria,insertVacantesFeria,updateVacanteFeria,deleteVacante,updateHorarioVacante, // MODULO VACANTES
  getPostulacionesEnf,aceptarPostulacion,rechazarPostulacion, //MODULO POSTULACIONES
  createFeria//FORMULARIO DE FERIA
  
};
