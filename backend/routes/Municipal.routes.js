const express = require('express');
const router = express.Router();
const {obtenerSolicitudes ,confirmSoli ,declineSoli} = require('../controllers/MunicipalController')

// RUTAS PARA EL PERFIL MUNICIPAL
router.post('/getSoliAper', (req , res) => {
    const pool = req.pool;
    const {id_user_adm} = req.body;
    obtenerSolicitudes(res,pool,id_user_adm);
  })


  router.post('/confirmSoli', (req , res) => {
    const pool = req.pool;
    const {id_feria , id_solicitud} = req.body;
    confirmSoli(res,pool,id_feria , id_solicitud);
  })


  router.post('/declineSoli', (req , res) => {
    const pool = req.pool;
    const {id_feria , id_solicitud} = req.body;
    declineSoli(res,pool,id_feria , id_solicitud);
  })


module.exports = router;