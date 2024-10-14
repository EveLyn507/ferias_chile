const express = require('express');
const router = express.Router();
const { guardarPerfil } = require('../controllers/perfilferianteController');

router.post('/api/perfil', (req, res) => {
    const pool = req.pool; 
    guardarPerfil(req, res, pool); 
  });

module.exports = router;
