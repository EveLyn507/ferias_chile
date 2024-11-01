const express = require('express');
const router = express.Router();
const puestoRoutes = require('./Puesto.routes');
const { 
  saveFeria, 
  getFeria ,get_feria_Encargado 
  ,abrirTiketFeria, UpdateProgramaFeria 
  ,getPrograma ,insertDatosBank,getDatosBank, 
  deleteBank,getVacantesFeria,insertVacantesFeria, 
  deleteVacante,updateVacanteFeria,updateHorarioVacante,
  getPostulaciones,rechazarPostulacion,aceptarPostulacion, createFeria} = require('../controllers/EncargadoController');


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



router.post('/insertBank', (req, res) => {
  const pool = req.pool
  const {mail_banco, nombre_asociado, numero_cuenta, encargado_mail} = req.body.encargadoBank
  insertDatosBank(res,pool,mail_banco, nombre_asociado, numero_cuenta, encargado_mail)
  }) 

router.post('/getBank', (req, res) => {
  const pool = req.pool
  const {id_user} = req.body
  getDatosBank(res,pool,id_user)
  
  }) 

router.post('/deleteBank', (req, res) => {
  const pool = req.pool
  const  {mail_banco} = req.body
  deleteBank(res,pool,mail_banco )
  }) 

router.post('/GetVacantesFeria', (req, res) => {
  const pool = req.pool
  getVacantesFeria(req,res,pool)
  }) 

router.post('/insertVacantesFeria', (req, res) => {
  const pool = req.pool
  const newVacante = req.body.vacante;
  insertVacantesFeria(res,pool,newVacante)
  }) 

router.post('/updateVacanteFeria', (req, res) => {
  const pool = req.pool
  updateVacanteFeria(req,res,pool)
  }) 

router.post('/deleteVacante', (req, res) => {
  const pool = req.pool
  deleteVacante(req,res,pool)
  }) 


router.post('/updateHorarioVacante', (req, res) => {
  const pool = req.pool
  updateHorarioVacante(req,res,pool)
  }) 

router.post('/getPostulaciones', (req, res) => {
  const pool = req.pool
  getPostulaciones(res,pool)
  }) 

router.post('/rechazarPostulacion', (req, res) => {
  const pool = req.pool
  rechazarPostulacion(res,pool)
  }) 
router.post('/aceptarPostulacion', (req, res) => {
  const pool = req.pool
  aceptarPostulacion(res,pool)
  }) 



module.exports = router;
