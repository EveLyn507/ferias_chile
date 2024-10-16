const express = require('express');
const router = express.Router();
const { get_feria,get_puestos_feria  } = require('../controllers/FeedController.js');

// RUTAS PARA EL FEED DE FERIAS
router.get('/Feed-ferias', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    get_feria(req,res,pool);
  })

  router.get('/ferias/:id_feria', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    get_puestos_feria(req,res,pool);
  })




module.exports = router;