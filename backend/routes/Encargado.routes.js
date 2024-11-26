const express = require('express');
const router = express.Router();
const { 
  saveFeria, 
  getPlanoElements ,get_feria_Encargado ,getFeriaBank,
  abrirTiketFeria,CreatePuesto,UpdatePuesto, UpdateProgramaFeria ,
  getPrograma ,insertDatosBank,getDatosBank, 
  deleteBank,getVacantesFeria,insertVacantesFeria, 
  deleteVacante,updateVacanteFeria,updateHorarioVacante,
  getPostulacionesEnf,rechazarPostulacion,aceptarPostulacion,updateDatosBank,createFeria,recargaStatus,asociarBankFeria} = require('../controllers/EncargadoController');


//PERFIL ENCARGADO 

//carga las ferias del encargado
router.post('/private/1', (req , res) => {
    const pool = req.pool;
    get_feria_Encargado(req,res,pool);
  })
  

//genera la solicitud de apertura de feria
router.post('/tiket', (req , res) => {
    const pool = req.pool; 
    const {id_feria } = req.body;
      abrirTiketFeria(res,pool,id_feria);
  })


//HERRAMIENTA DE PLANOS
// Ruta para guardar una feria
router.post('/api/feria', saveFeria); // Cambiado para incluir '/api'

// carga los elementos de he planos
router.get('/api/feria/:id_feria', (req, res )=> {
  const pool = req.pool; 
  const {id_feria} = req.params;
  getPlanoElements(res,pool,id_feria);
});

router.post('/tiket', (req , res) => {
  const pool = req.pool; 
      abrirTiketFeria(req,res,pool);
})

router.post('/CreatePuesto', (req , res) => {
  const pool = req.pool; 
  const newPuesto = req.body.newPuesto;
    CreatePuesto(res,pool , newPuesto);
})


router.post('/UpdatePuesto', (req , res) => {
  const pool = req.pool; 
  const {id_tipo_puesto , descripcion , id_estado_puesto , id_feria,numero} = req.body.updatedPuesto;
  console.log(numero);
  
  UpdatePuesto(res,pool, id_tipo_puesto , descripcion , id_estado_puesto , id_feria,numero);
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
  const {mail_banco, nombre_asociado, numero_cuenta, id_user_enf} = req.body.encargadoBank
  insertDatosBank(res,pool,mail_banco, nombre_asociado, numero_cuenta, id_user_enf)
  }) 

router.post('/getBank', (req, res) => {
  const pool = req.pool
  const {id_user_enf} = req.body
  getDatosBank(res,pool,id_user_enf)
  
  }) 


  router.post('/updateDatosBank', (req, res) => {
    const pool = req.pool
    const {mail_banco, nombre_asociado, numero_cuenta, id_user_enf} = req.body.encargadoBank
    updateDatosBank(res,pool,mail_banco, nombre_asociado, numero_cuenta, id_user_enf)
    }) 


router.post('/deleteBank', (req, res) => {
  const pool = req.pool
  const  {mail_banco} = req.body
  deleteBank(res,pool,mail_banco )
  }) 

router.post('/GetVacantesFeria', (req, res) => {
  const pool = req.pool
  const { id_feria } = req.body;
  getVacantesFeria(res,pool , id_feria)
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

router.post('/getPostulacionesEnf', (req, res) => {
  const pool = req.pool
  const {id_user_enf , id_feria , id_vacante} = req.body
  getPostulacionesEnf(res,pool,id_user_enf , id_feria , id_vacante)
  }) 

router.post('/aceptarPostulacion', (req, res) => {
  const pool = req.pool
  const  {id_postulacion,id_vacante,id_user_fte} = req.body
  aceptarPostulacion(res,pool,id_postulacion,id_vacante,id_user_fte)
  }) 

router.post('/rechazarPostulacion', (req, res) => {
  const pool = req.pool
  const  {id_postulacion,id_vacante,id_user_fte} = req.body  
  rechazarPostulacion(res,pool,id_postulacion,id_vacante,id_user_fte)
  }) 
router.post('/aceptarPostulacion', (req, res) => {
  const pool = req.pool
  aceptarPostulacion(res,pool)
  }) 

router.post('/recargaStatus', (req, res) => {
  const pool = req.pool
  const {id_feria} = req.body
  recargaStatus(res,pool,id_feria)
  }) 

router.post('/getFeriaBank', (req, res) => {
  const pool = req.pool
  const {id_feria} = req.body
  getFeriaBank(res,pool,id_feria)
  }) 


router.post('/asociarBankFeria', (req, res) => {
  const pool = req.pool
  const {mail_banco , id_feria} = req.body
  asociarBankFeria(res,pool,mail_banco,id_feria)
  }) 
  
//// FORMULARIO CREACION DE FERIA
  router.post('/createFeria', createFeria);

module.exports = router;
