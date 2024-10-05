const express = require('express');
const { login, register } = require('../controllers/usuarioController');
const router = express.Router();


// Ruta de login
router.post('/login', (req, res) => {
    const pool = req.pool; // Recuperar el pool del objeto req
    login(req, res, pool); // Pasar el pool a la función de login
  });

  
router.post('/register', register);

module.exports = router;
