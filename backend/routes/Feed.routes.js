const express = require('express');
const router = express.Router();
const { get_feria,get_puestos_feria, get_puestos_actividad  } = require('../controllers/FeedController.js');

// RUTAS PARA EL FEED DE FERIAS
router.post('/Feed-ferias', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    const { page = 1, limit = 10 , idComuna , idRegion} = req.body; // Paginación: página y límite
    const offset = (page - 1) * limit;
  
    get_feria(res, pool, limit, offset, idComuna, idRegion );
  })

  router.get('/ferias/:id_feria', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    get_puestos_feria(req,res,pool);
  })


router.get('/getPuestosActividad/:nombre_feria/:date', (req , res) => {
  const pool = req.pool; // Recuperar el pool del objeto req
  const { nombre_feria, date } = req.params;
  get_puestos_actividad(res,pool, nombre_feria, date);
})




module.exports = router;