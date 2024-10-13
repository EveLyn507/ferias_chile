const express = require('express');
const bodyParser = require('body-parser');
const { WebpayPlus } = require('transbank-sdk'); // Usar solo transbank-sdk

const router = express.Router();
router.use(bodyParser.json());

const webpayPlus = new WebpayPlus.Transaction();
WebpayPlus.configureForTesting();

router.post('/webpay/init', async (req, res) => {
  const { amount } = req.body;
  try {
    const buyOrder = 'ORDEN_COMPRA_' + Math.floor(Math.random() * 1000000); // Orden única
    const sessionId = 'SESION_' + Math.floor(Math.random() * 1000000);      // Sesión única

    // Crear transacción
    const response = await webpayPlus.create(
      buyOrder,          // Orden de compra
      sessionId,         // ID de sesión
      amount,            // Monto de la transacción
      'http://localhost:5000/api/webpay/return' // URL de retorno
    );

    console.log('URL de Webpay:', response.url);  // Agregar esto
    res.json({ url: response.url, token: response.token });
  } catch (error) {
    console.error('Error en la transacción:', error);
    res.status(500).send('Error en el proceso de pago');
  }
});



module.exports = router;
