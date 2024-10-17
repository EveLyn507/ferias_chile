const WebpayPlus = require("transbank-sdk").WebpayPlus;


const saveTransactionToDatabase = async ( pool, id_puesto,mail_feriante,id_tipo_pago, estado_contrato, precio, buyOrder, sessionId) => {
  const timestampUTC = new Date().toISOString(); 
  await pool.query(`
    INSERT INTO contrato_puesto (fecha , id_puesto,mail_feriante,id_tipo_pago, estado_contrato, precio, buy_order, session_id)
    VALUES ($1, $2, $3, $4,$5,$6,$7,$8)`,
    [ timestampUTC,id_puesto,mail_feriante,id_tipo_pago, estado_contrato, precio, buyOrder, sessionId]);
};

// Función para crear la transacción
const createTransaction = async (req, res, pool) => {
  const { puesto, mail } = req.body; // Obtener datos del POST
  const returnUrl = `http://localhost:5173/pagos/estado`; // URL de retorno
  const emailFragment = mail.split('@')[0];
  const timestamp = new Date().getTime();  // Obtener el timestamp actual
  const sessionId = `session-${puesto.id_puesto}-${timestamp}`;
  const buyOrder = `order-${puesto.id_puesto}-${timestamp}-${emailFragment}`;
  const amount = puesto.precio
  
  try {
    // Crear la transacción con Transbank
    const response = await (new WebpayPlus.Transaction()).create(buyOrder, sessionId, amount, returnUrl);
    const { token, url } = response;

    // Guardar la transacción en la base de datos como "pendiente"
    await saveTransactionToDatabase( pool ,puesto.id_puesto,mail,1, 1, puesto.precio, buyOrder, sessionId);

    // Responder con la URL y el token
    res.json({ token, url });
  } catch (error) {
    console.error('Error creando la transacción:', error);
    res.status(500).json({ error: error.message });
  }
};
const updateTransactionStatus = async (buyOrder, status, pool) => {
  try {
    await pool.query(`
      UPDATE contrato_puesto
      SET estado_contrato = $1
      WHERE buy_order = $2`,
      [status, buyOrder]);
  } catch (error) {
    console.error('Error actualizando el estado de la transacción:', error);
  }
};




// Función para confirmar el commit
const commitTransaction = async (req, res, pool) => {
  const { token_ws } = req.body;

  try {
    const response = await (new WebpayPlus.Transaction()).commit(token_ws);
 
    
    if (response.status === 'AUTHORIZED') {
      // Actualizar la transacción en la base de datos como "completada"
      await updateTransactionStatus(response.buy_order, 2, pool);
      res.json(response);  // Responder con la respuesta exitosa de la transacción
    } else {
      await updateTransactionStatus(response.buy_order, 3,pool);
      res.status(400).json({ error: 'Transacción no autorizada o fallida' });
    }
  } catch (error) {
    console.error('Error confirmando la transacción:', error);
    res.status(500).json({ error: 'Error al confirmar la transacción' });
  }
};




// Exportar las funciones
module.exports = {
  createTransaction,
  commitTransaction,
};
