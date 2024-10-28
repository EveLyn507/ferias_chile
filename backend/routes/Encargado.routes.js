const express = require('express');
const router = express.Router();
const puestoRoutes = require('./Puesto.routes');
const { saveFeria, getFeria ,get_feria_Encargado ,abrirTiketFeria, UpdateProgramaFeria ,getPrograma ,saveDatosBank,getDatosBank, deleteBank,getVacantesFeria,SaveVacantesFeria, deleteVacante,updateVacanteFeria} = require('../controllers/EncargadoController');


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
router.get('/api/feria/:id_feria', getFeria);

router.post('/tiket', (req , res) => {
  const pool = req.pool; 
      abrirTiketFeria(req,res,pool);
})


//ADMINISTRACION DE LA FERIA

router.post('/administracion/:id_feria', (req, res) => {
const pool = req.pool
UpdateProgramaFeria(req,res,pool)

}) 


router.get('/getProgramacion/:id_feria', (req, res) => {
  const pool = req.pool
    getPrograma(req,res,pool)
  
  }) 



router.post('/saveBank', (req, res) => {
  const pool = req.pool
  saveDatosBank(req,res,pool)
  
  }) 

router.post('/getBank', (req, res) => {
  const pool = req.pool
  getDatosBank(req,res,pool)
  
  }) 


  router.post('/deleteBank', (req, res) => {
    const pool = req.pool
    deleteBank(req,res,pool)
    }) 



  router.post('/GetVacantesFeria', (req, res) => {
    const pool = req.pool
    getVacantesFeria(req,res,pool)
    }) 



router.post('/SaveVacantesFeria', (req, res) => {
  const pool = req.pool
  SaveVacantesFeria(req,res,pool)
  }) 

  router.post('/updateVacanteFeria', (req, res) => {
    const pool = req.pool
    updateVacanteFeria(req,res,pool)
    }) 

  router.post('/deleteVacante', (req, res) => {
    const pool = req.pool
    deleteVacante(req,res,pool)
    }) 
    

module.exports = router;
