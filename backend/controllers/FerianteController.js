const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { log } = require('console');
const pool = require('../server');

// Controlador para obtener el estado del perfil
const getEstadoPerfil = async (req, res) => {
  const { userMail } = req.params;

  if (!userMail) {
    return res.status(400).json({ message: 'El correo del usuario es obligatorio.' });
  }

  try {
    const query = 'SELECT perfil_privado FROM feriante WHERE user_mail = $1';
    const result = await req.pool.query(query, [userMail]);

    if (result.rows.length === 0) {
      console.error(`Usuario no encontrado: ${userMail}`);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ perfil_privado: result.rows[0].perfil_privado });
  } catch (error) {
    console.error('Error al obtener el estado del perfil:', error);
    res.status(500).json({ message: 'Error al obtener el estado del perfil.' });
  }
};

// Función para alternar el estado de perfil (público/privado)
const togglePerfilPrivado = async (req, res, pool) => {
  const { userMail } = req.body;

  try {
    const result = await pool.query(
      'SELECT perfil_privado FROM feriante WHERE user_mail = $1',
      [userMail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const currentStatus = result.rows[0].perfil_privado;
    const newStatus = !currentStatus;

    await pool.query(
      'UPDATE feriante SET perfil_privado = $1 WHERE user_mail = $2',
      [newStatus, userMail]
    );

    res.status(200).json({ message: 'Estado del perfil actualizado correctamente', perfil_privado: newStatus });
  } catch (error) {
    console.error('Error al cambiar el estado del perfil:', error);
    res.status(500).json({ message: 'Error al cambiar el estado del perfil' });
  }
};

// Función para actualizar datos personales
const actualizarDatosPersonales = async (res, pool, nombre, apellido, telefono, id_user) => {
  try {
    // Validar los datos de entrada
    if (!nombre || !apellido || !telefono || !id_user) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Validar que el teléfono sea un número
    const telefonoEntero = parseInt(telefono, 10);
    if (isNaN(telefonoEntero)) {
      return res.status(400).json({ message: 'El teléfono debe ser un número válido.' });
    }

    // Consulta SQL para actualizar datos personales
    const query = `
      UPDATE feriante
      SET nombre = $1, apellido = $2, telefono = $3
      WHERE id_user_fte = $4;
    `;
    await pool.query(query, [nombre, apellido, telefonoEntero, id_user]);

    // Responder con éxito
    res.status(200).json({ message: 'Datos personales actualizados correctamente.' });
  } catch (error) {
    console.error('Error al actualizar los datos personales:', error);
    res.status(500).json({ message: 'Error al actualizar los datos personales.' });
  }
};

// Función para cargar datos personales
const cargarDatosPersonales = async (req, res) => {
  console.log('Entrando al controlador cargarDatosPersonales');
  console.log('req.params:', req.params); // Verificar qué contiene req.params

  const { id_user } = req.params;

  if (!id_user) {
    console.error('ID de usuario no proporcionado');
    return res.status(400).json({ message: 'El ID de usuario es obligatorio.' });
  }

  try {
    console.log('Consultando la base de datos con id_user:', id_user);
    const query = `
      SELECT nombre, apellido, telefono
      FROM feriante
      WHERE id_user_fte = $1;
    `;
    const result = await req.pool.query(query, [id_user]);

    console.log('Resultado de la consulta:', result.rows);

    if (result.rows.length === 0) {
      console.error('Usuario no encontrado en la base de datos');
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    console.log('Enviando datos al cliente:', result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al cargar datos personales:', error);
    res.status(500).json({ message: 'Error al cargar datos personales.' });
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
const guardarFotoPerfil = async (req, res) => {
  const { foto, userMail } = req.body;
  const filename = sanitizeFilename(userMail);
  const filePath = path.join(uploadDir, filename);
  const base64Data = foto.replace(/^data:image\/\w+;base64,/, "");

  try {
    await fs.promises.writeFile(filePath, base64Data, 'base64');
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

// Función para actualizar correo
const actualizarCorreo = async (req, res, pool) => {
  const { nuevoCorreo, user_mail } = req.body;

  if (!nuevoCorreo || !user_mail) {
    return res.status(400).json({ message: 'El correo actual y el nuevo correo son obligatorios.' });
  }

  try {
    await pool.query('BEGIN');

    // Actualizar el correo en la tabla feriante
    const queryFeriante = 'UPDATE feriante SET user_mail = $1 WHERE user_mail = $2;';
    await pool.query(queryFeriante, [nuevoCorreo, user_mail]);

    // Actualizar intereses relacionados (si corresponde)
    const queryIntereses = `
      UPDATE intereses
      SET id_user_fte = (
        SELECT id_user_fte
        FROM feriante
        WHERE user_mail = $1
      )
      WHERE id_user_fte = (
        SELECT id_user_fte
        FROM feriante
        WHERE user_mail = $2
      );
    `;
    await pool.query(queryIntereses, [nuevoCorreo, user_mail]);

    const queryRedesSociales = `
      UPDATE redes_sociales
      SET id_user_fte = (
        SELECT id_user_fte
        FROM feriante
        WHERE user_mail = $1
      )
      WHERE id_user_fte = (
        SELECT id_user_fte
        FROM feriante
        WHERE user_mail = $2
      );
    `;
    await pool.query(queryRedesSociales, [nuevoCorreo, user_mail]);

    await pool.query('COMMIT');
    res.status(200).json({ message: 'Correo actualizado correctamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al actualizar el correo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


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

// Función para obtener tipos de redes sociales
const obtenerTiposRed = async (req, res) => {
  try {
    const query = 'SELECT id_tipo_red, red_social FROM tipo_red';
    const result = await req.pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener tipos de redes sociales:', error);
    res.status(500).json({ message: 'Error al obtener tipos de redes sociales' });
  }
};

// Función para obtener redes sociales del usuario
const obtenerRedesSociales = async (req, res) => {
  const { userMail } = req.params;
  try {
    const query = `
      SELECT rs.id_redes AS id, tr.red_social AS tipo, rs.url_red AS url, tr.url_foto_red AS url_foto_red
      FROM redes_sociales rs
      JOIN tipo_red tr ON rs.tipo_red = tr.id_tipo_red
      WHERE rs.id_user_fte = (SELECT id_user_fte FROM feriante WHERE user_mail = $1)
    `;
    const result = await req.pool.query(query, [userMail]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener redes sociales:', error);
    res.status(500).json({ message: 'Error al obtener redes sociales' });
  }
};

// Función para agregar una nueva red social
const agregarRedSocial = async (req, res) => {
  const { id_user, tipoRed, url } = req.body;

  if (!id_user) {
    return res.status(400).json({ message: 'ID de usuario es necesario para agregar una red social.' });
  }

  try {
    const query = `
      INSERT INTO redes_sociales (id_user_fte, tipo_red, url_red)
      VALUES ($1, (SELECT id_tipo_red FROM tipo_red WHERE red_social = $2), $3)
      RETURNING id_redes AS id
    `;
    const result = await req.pool.query(query, [id_user, tipoRed, url]);
    res.status(200).json({ id: result.rows[0].id, tipo: tipoRed, url });
  } catch (error) {
    console.error('Error al agregar red social:', error);
    res.status(500).json({ message: 'Error al agregar red social' });
  }
};

// Función para eliminar una red social
const eliminarRedSocial = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM redes_sociales WHERE id_redes = $1';
    await req.pool.query(query, [id]);
    res.status(200).json({ message: 'Red social eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar red social:', error);
    res.status(500).json({ message: 'Error al eliminar red social' });
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
  
  
const misPostulaciones = async(res , pool, id_user_fte) => {

  try {
    const resutl = await pool.query(`
      SELECT 
      f.id_feria,
      p.id_postulacion,
      ep.estado,
      f.nombre as nombre_feria,
      re.rol,
      dtv.ingreso as fecha_ingreso,
      dtv.termino as fecha_termino
  
      FROM postulaciones p 
      JOIN estado_postulacion ep ON  ep.id_estado = p.id_estado
      LEFT JOIN detalle_team_vacante dtv ON p.id_vacante = dtv.id_vacante
      JOIN feria f ON dtv.id_feria = f.id_feria
      JOIN rol_empleado re ON re.id_rol = dtv.id_rol
      WHERE p.id_user_fte = $1
      ` , [id_user_fte])  
  
      res.json(resutl.rows)
    
  } catch (error) {
    res.status(500).json({msj : 'error interno al obtener las vacantes del usuario'} )
  }
} 



module.exports = {
  getEstadoPerfil,
  togglePerfilPrivado,
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
  obtenerTiposRed,
  obtenerRedesSociales,
  agregarRedSocial,
  eliminarRedSocial,
  getVacantesVacias,   //inicio modulo postulaciones
  insertPostulacion,
  misPostulaciones
};