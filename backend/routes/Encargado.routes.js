const express = require('express');
const router = express.Router();
const { saveFeria, getFeria ,get_feria_Encargado ,abrirTiketFeria} = require('../controllers/EncargadoController');


//PERFIL ENCARGADO 

//carga las ferias del encargado
router.post('/private/1', (req , res) => {
    const pool = req.pool;
    get_feria_Encargado(req,res,pool);
  })
  

//genera la solicitud de apertura de feria
router.post('/tiket', (req , res) => {
    const pool = req.pool; 
        abrirTiketFeria(req,res,pool);
  })






  //HERRAMIENTA DE PLANOS
  // Ruta para guardar una feria
router.post('/api/feria', saveFeria); // Cambiado para incluir '/api'

// Ruta para obtener una feria por ID
router.get('/api/feria/:id', getFeria);


module.exports = router;
