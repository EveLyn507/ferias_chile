const express = require('express');
const router = express.Router();
const {obtenerSolicitudes} = require('../controllers/MunicipalController')

// RUTAS PARA EL PERFIL MUNICIPAL
router.post('/private/3', (req , res) => {
    const pool = req.pool;
    obtenerSolicitudes(req,res,pool);
  })


module.exports = router;