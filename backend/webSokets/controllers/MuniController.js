const obtenerSolicitudes = async (socket, pool, id_adm) => {

  const {id_user_adm} = id_adm.params

  console.log('ID del admin recibido:', id_user_adm); 

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
        WHERE sa.id_user_adm = $1 AND sa.id_estado = 1`,
        [id_user_adm]
      );
  
      // Emitir las solicitudes obtenidas al cliente conectado
      console.log('Resultado de la consulta:', result.rows);
      socket.emit('solicitud_response', result.rows);
    } catch (err) {
      console.error('Error al obtener las solicitudes del admin:', err);
      socket.emit('error', 'Error al obtener las solicitudes del admin');
    }
  };
  
  const confirmSoli = async (socket, pool, id_feria, id_solicitud) => {
    try {
      // Verificar los parámetros
      console.log("Parámetros recibidos:", { id_feria, id_solicitud });
  
      // Actualizar la solicitud
      const solicitudResult = await pool.query(
        `UPDATE solicitudes_apertura
        SET id_estado = 2
        WHERE id_solicitud = $1`,
        [id_solicitud] // Asegúrate de que id_solicitud no sea undefined
      );
      console.log("Resultado de la actualización de solicitudes:", solicitudResult.rowCount);
  
      // Actualizar la feria
      const feriaResult = await pool.query(
        `UPDATE feria
        SET id_estado = 4
        WHERE id_feria = $1`,
        [id_feria] // Asegúrate de que id_feria no sea undefined
      );
      console.log("Resultado de la actualización de feria:", feriaResult.rowCount);
  
      // Emitir la confirmación a los clientes
      socket.emit("solicitud_confirmada", { id_feria, id_solicitud });
      socket.broadcast.emit("solicitud_confirmada", { id_feria, id_solicitud });
    } catch (err) {
      console.error("Error al confirmar feria:", err);
      socket.emit("error", "Error al confirmar feria");
    }
  };
  
  
  const declineSoli = async (socket, pool, id_feria, id_solicitud) => {
    try {
      // Actualizar la solicitud a "rechazada" (id_estado = 3)
      await pool.query(
        `UPDATE solicitudes_apertura
        SET id_estado = 3
        WHERE id_solicitud = $1`,
        [id_solicitud]
      );
  
      // Actualizar la feria a "rechazada" (id_estado = 3)
      await pool.query(
        `UPDATE feria
        SET id_estado = 3
        WHERE id_feria = $1`,
        [id_feria]
      );
  
      // Emitir la notificación de rechazo a todos los clientes
      socket.emit('solicitud_rechazada', { id_feria, id_solicitud });
      socket.broadcast.emit('solicitud_rechazada', { id_feria, id_solicitud }); // Emitir a otros clientes
  
    } catch (err) {
      console.error('Error al rechazar feria:', err);
      socket.emit('error', 'Error al rechazar feria');
    }
  };
  
  
  module.exports = { obtenerSolicitudes, confirmSoli, declineSoli };
  


