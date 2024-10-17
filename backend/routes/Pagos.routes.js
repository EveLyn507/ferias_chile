const express = require('express');
const router = express.Router();
const {createTransaction,commitTransaction} = require('../controllers/PagosController.js')


// RUTAS PARA GENERAR PAGO  
// crea  una transaccion
router.post('/api/webpay/create', async (req, res) => {
  const pool = req.pool;
  createTransaction(req,res,pool);
});




router.post('/api/webpay/commit', async (req, res) => {
  const pool = req.pool;
  commitTransaction(req,res,pool);
});


module.exports = router;