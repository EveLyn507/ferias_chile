const express = require('express');
const router = express.Router();
const pool = require('../credenciales');
const { login_encargado,login_feriante,login_municipal, registerEncargado_feria, registerFeriante, registerAdministrador_municipal, registerGoogleFeriante, recuperarContrasena, verificarTokenRecuperacion } = require('../controllers/BasicUserController.js');
const { get_feria,get_puestos_feria  } = require('../controllers/FeedController.js');

// Ruta de login
router.post('/login1', (req, res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    login_encargado(req, res, pool); // Pasar el pool a la función de login
  });


  router.post('/login2', (req, res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    login_feriante(req, res, pool); // Pasar el pool a la función de login
  });


  router.post('/login3', (req, res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    login_municipal(req, res, pool); // Pasar el pool a la función de login
  });


  router.post('/registro/encargado', (req, res) => {
    const pool = req.pool;
    registerEncargado_feria(req, res, pool);
  });

  router.post('/registro/feriante', (req, res) => {
    const pool = req.pool;
    registerFeriante(req, res, pool);
  });

  router.post('/registro/municipal', (req, res) => {
    const pool = req.pool;
    registerAdministrador_municipal(req, res, pool);
  });


  router.get('/Feed-ferias', (req , res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    get_feria(req,res,pool);
  })

  router.get('/ferias/:id_feria', (req , res) => {
    const pool = req.pool;
    get_puestos_feria(req,res,pool);
  })

  // Ruta de registro con Google
router.post('/registro/google', (req , res) => {
  const pool = req.pool;
  registerGoogleFeriante(req,res,pool);
})

// Ruta para enviar enlace de recuperación
router.post('/recuperacion', (req, res) => {
  const pool = req.pool;
  recuperarContrasena(req, res,pool);
});

// Ruta para restablecer contraseña
router.post('/reset-password', (req, res) => {
  const pool = req.pool;
  verificarTokenRecuperacion(req, res,pool);
});


module.exports = router;
