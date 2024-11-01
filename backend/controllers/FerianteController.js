const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { log } = require('console');

// Función para actualizar datos personales
const actualizarDatosPersonales = async (res,pool , userMail, nombre, apellido, telefono , id_user) => {
  try {
    const telefonoEntero = parseInt(telefono, 10);
    const query = `
      UPDATE feriante
      SET nombre = $1, apellido = $2, telefono = $3
      WHERE id_user_fte = $4;
    `;
    await pool.query(query, [nombre, apellido, telefonoEntero,id_user]);
    res.status(200).json({ message: 'Datos personales actualizados correctamente' });
  } catch (error) {
    console.error('Error al actualizar los datos personales:', error);
    res.status(500).json({ message: 'Error al actualizar los datos personales' });
  }
};

// Función para cargar datos personales
const cargarDatosPersonales = async (res,pool,id_user) => {

  try {
    const query = `
      SELECT nombre, apellido, telefono
      FROM feriante
      WHERE id_user_fte = $1;
    `;
    const result = await pool.query(query, [id_user]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al cargar nombre, apellido telefono:', error);
    res.status(500).json({ message: 'Error al cargar nombre, apellido y telefono' });
  }
};

// Función para actualizar biografía
const guardarBiografia = async (id_user, biografia, res,pool) => {
  try {
    const query = `UPDATE feriante 
    SET biografia = $1 
    WHERE id_user_fte = $2;`

    await pool.query(query, [biografia,id_user]);
    res.status(200).json({ message: 'Biografía actualizada con éxito' });
  } catch (error) {
    console.error('Error al actualizar la biografía:', error);
    res.status(500).json({ message: 'Error al actualizar la biografía' });
  }
};

// Función para cargar biografía
const cargarBiografia = async ( res, id_user, pool) => {

  try {
    const query = 'SELECT biografia FROM feriante WHERE id_user_fte = $1;';
    const result = await pool.query(query, [id_user]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ biografia: result.rows[0].biografia });
  } catch (error) {
    console.error('Error al obtener la biografía:', error);
    res.status(500).json({ message: 'Error al obtener la biografía' });
  }
};

// Función para limpiar y asegurar el nombre del archivo basado en el correo del usuario
const sanitizeFilename = (email) => {
  return email.replace(/[^a-zA-Z0-9]/g, '_') + '_fotoPerfil.png';
};

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Función para guardar foto de perfil
const guardarFotoPerfil = async (req, res, pool) => {
  const { foto, userMail } = req.body;
  const filename = sanitizeFilename(userMail);
  const filePath = path.join(uploadDir, filename);
  
  try {
    await fs.promises.writeFile(filePath, foto, 'base64');
    res.json({ url_foto: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error al guardar la foto de perfil:', error);
    res.status(500).json({ message: 'Error al guardar la foto.' });
  }
};

// Función para cargar foto de perfil
const cargarFotoPerfil = (req, res) => {
  const { userMail } = req.params;
  const filename = sanitizeFilename(userMail);
  const filePath = path.join(uploadDir, filename);
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'Foto de perfil no encontrada' });
  }
};

// Función para actualizar intereses
const actualizarIntereses = async ( res,pool, id_user, intereses) => {
  try {
    await pool.query('BEGIN');
    await pool.query('DELETE FROM intereses WHERE id_user_fte = $1;', [id_user]);

    if (intereses && intereses.length > 0) {
      const queryIntereses = 'INSERT INTO intereses (interes, id_user_fte) VALUES ($1, $2);';
      for (const interes of intereses) {
        await pool.query(queryIntereses, [interes, id_user]);
      }
    }
    await pool.query('COMMIT');
    res.status(200).json({ message: 'Intereses actualizados correctamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al actualizar intereses:', error);
    res.status(500).json({ message: 'Error al actualizar intereses' });
  }
};

// Función para cargar intereses
const cargarIntereses = async (res, pool, id_user) => {
  try {
    const query = 'SELECT interes FROM intereses WHERE id_user_fte = $1;';
    const result = await pool.query(query, [id_user]);
    res.status(200).json(result.rows.map(row => row.interes));
  } catch (error) {
    console.error('Error al cargar intereses:', error);
    res.status(500).json({ message: 'Error al cargar intereses' });
  }
};

const actualizarCorreo = async (req, res,pool) => { 
  const { nuevoCorreo, user_mail } = req.body;
  try {
    
    await pool.query(`
      UPDATE feriante 
      SET user_mail = $1
      WHERE user_mail = $2
      `, [nuevoCorreo, user_mail])
      res.status(200)
  } catch (error) {

    console.log(error)
    res.status(500).json({ message: 'Error interno del servidor',error });
  }
  }


// Función para actualizar la contraseña
const actualizarContraseña = async (req, res) => {
  const { nuevaContraseña, id_user_fte } = req.body;
  if (!nuevaContraseña) {
    return res.status(400).json({ message: 'La nueva contraseña es requerida' });
  }

  try {
    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

    const query = 'UPDATE feriante SET contrasena = $1 WHERE id_user_fte = $2;';
    await req.pool.query(query, [hashedPassword, id_user_fte]);

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// INICIO MODULO POSTULACIONES 


// obtiene todas las vacantes donde feriante sea null -- osea que esten vacias/disponibles
const getHorariosVacante = async (idsvacante, pool) =>{
  const result = await pool.query(`
    SELECT * FROM detalle_horario_empleado 
    WHERE id_vacante = ANY($1)
    ` , [idsvacante])
    return result.rows;
  }
  

  const getVacantesVacias = async ( res, pool) => {

    try {
      const result = await pool.query(` 
        SELECT id_vacante ,id_user_fte, id_rol, id_feria, to_char(ingreso, 'YYYY-MM-DD') as ingreso,to_char(termino, 'YYYY-MM-DD') as termino, id_estado_vacante
        FROM detalle_team_vacante
        WHERE id_user_fte IS NULL; 
      `);
  
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

  const insertPostulacion = async ( res, pool, id_user_fte , user_mail, id_vacante) => {
    try {
      // Consulta combinada para verificar usuario y postulación existente
      const result = await pool.query(
        `
        SELECT 
          EXISTS (SELECT 1 FROM feriante WHERE id_user_fte = $1 AND user_mail = $2) AS usuario_valido,
          EXISTS (SELECT 1 FROM postulaciones WHERE id_user_fte = $1 AND id_vacante = $3) AS postulacion_duplicada
        `,
        [id_user_fte, user_mail, id_vacante]
      );
  
      const { usuario_valido, postulacion_duplicada } = result.rows[0];
  
      // Validación de los resultados
      if (!usuario_valido) {
        return res.status(404).json({ msj: 'El usuario no coincide en sus credenciales' });
      } 
      
      if (postulacion_duplicada) {
        return res.status(409).json({ msj: 'Ya postulaste a esta vacante' });
      }
  
      // Inserción de la postulación si las validaciones pasaron
      await pool.query(
        `INSERT INTO postulaciones (id_vacante, id_user_fte) VALUES ($1, $2)`,
        [id_vacante, id_user_fte]
      );
      
      res.json({ msj: 'Postulación exitosa' });
    } catch (error) {
      console.error('Error al ingresar la postulación:', error);
      res.status(500).json({ msj: 'Error en el servidor' });
    }
  };
  
  
module.exports = {
  actualizarDatosPersonales,
  cargarDatosPersonales,
  guardarBiografia,
  cargarBiografia,
  guardarFotoPerfil,
  cargarFotoPerfil,
  actualizarIntereses,
  cargarIntereses,
  actualizarCorreo,
  actualizarContraseña,
  getVacantesVacias,   //inicio modulo postulaciones
  insertPostulacion
};
