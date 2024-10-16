const express = require('express');
const router = express.Router();
const { login, register  } = require('../controllers/BasicUserController.js');
const { get_feria,get_puestos_feria  } = require('../controllers/FeedController.js');

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
    const pool = req.pool;
    get_puestos_feria(req,res,pool);
  })

module.exports = router;
