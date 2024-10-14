const express = require('express');
const { login, register , get_feria_Encargado , abrirTiketFeria } = require('../controllers/usuarioController.js');
const { get_feria,get_puestos_feria  } = require('../controllers/feedController.js');
const {createTransaction,commitTransaction} = require('../controllers/pagosController.js')
const router = express.Router();


// Ruta de login
router.post('/login', (req, res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    login(req, res, pool); // Pasar el pool a la función de login
  });

  router.post('/registro', (req, res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    register(req, res, pool); // Pasar el pool a la función de login
  });


  router.get('/Feed-ferias', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    get_feria(req,res,pool);
  })


  
  router.get('/ferias/:id_feria', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    get_puestos_feria(req,res,pool);
  })


  router.post('/private/1', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    get_feria_Encargado(req,res,pool);
  })
  


// RUTAS PARA EL PERFIL ENCARGADO


router.post('/tiket', (req , res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  abrirTiketFeria(req,res,pool);
})



// RUTAS PARA GENERAR PAGO  



// crea  una transaccion
router.post('/api/webpay/create', async (req, res) => {
  createTransaction(req,res);
});


router.post('/api/webpay/commit', commitTransaction);





module.exports = router;
