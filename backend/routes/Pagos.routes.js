const express = require('express');
const router = express.Router();
const {createTransaction,commitTransaction} = require('../controllers/pagosController.js')


// RUTAS PARA GENERAR PAGO  
// crea  una transaccion
router.post('/api/webpay/create', async (req, res) => {
  createTransaction(req,res);
});


router.post('/api/webpay/commit', commitTransaction);

module.exports = router;