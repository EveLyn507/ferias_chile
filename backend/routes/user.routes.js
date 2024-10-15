const express = require('express');
const { login, register , get_feria_Encargado,tb_pago } = require('../controllers/usuarioController.js');
const { get_feria,get_puestos_feria ,  } = require('../controllers/feedController.js');
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
  

  router.post('mi-sitio.com/retorno') , (req , res) =>{
    tb_pago(req,res);
  }

module.exports = router;
