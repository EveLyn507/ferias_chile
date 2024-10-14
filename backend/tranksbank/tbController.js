const express = require('express');
const { WebpayPlus } = require('transbank-sdk');
const cors = require('cors');  // Importar cors

const app = express();
app.use(cors());  // Usar el middleware cors
app.use(express.json());

// Instancia la transacción de WebpayPlus
const webpay = new WebpayPlus.Transaction();

// Ruta para crear una transacción
app.post('/api/webpay/create', async (req, res) => {
  try {
    const { buyOrder, sessionId, amount, returnUrl } = req.body;
    const response = await webpay.create(buyOrder, sessionId, amount, returnUrl);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para confirmar una transacción
app.post('/api/webpay/commit', async (req, res) => {
  try {
    const { token } = req.body;
    const response = await webpay.commit(token);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
