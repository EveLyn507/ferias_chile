const express = require('express');
const { WebpayPlus } = require('transbank-sdk');

const router = express.Router();
router.use(express.json());

// Configura el entorno de testing
WebpayPlus.configureForTesting();

const webpayPlus = new WebpayPlus.Transaction();

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

    const {url , token} = req.body;


    res.json({ url, token});
  } catch (error) {
    console.error('Error en la transacción:', error);
    res.status(500).send('Error en el proceso de pago');
  }
});

module.exports = router;
