const WebpayPlus = require("transbank-sdk").WebpayPlus;

// Función para crear la transacción
const createTransaction = async (req, res) => {
  const { buyOrder, sessionId, amount } = req.body; // Obtener datos del POST
  const returnUrl = `http://localhost:5173/pagos/estado`; // URL de retorno

  try {
    const response = await (new WebpayPlus.Transaction()).create(buyOrder, sessionId, amount, returnUrl);
    const { token, url } = response;

    // Responder con la URL y el token
    res.json({ token, url });
  } catch (error) {
    console.error('Error creando la transacción:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función para confirmar el commit
const commitTransaction = async (req, res) => {
  const { token_ws } = req.body; // Obtener el token desde el body

  try {
    const response = await (new WebpayPlus.Transaction()).commit(token_ws);
    res.json(response); // Responder con la respuesta de la transacción
  } catch (error) {
    console.error('Error confirmando la transacción:', error);
    res.status(500).json({ error: 'Error al confirmar la transacción' }); // Responder con un error 500
  }
};


// Exportar las funciones
module.exports = {
  createTransaction,
  commitTransaction,
};
