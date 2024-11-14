// utils/auth.js
const jwt = require('jsonwebtoken');

function verifyToken(token) {
  try {
    return jwt.verify(token, 'your-secret-key');
  } catch (error) {
    console.error('Token no válido:', error);
    return null;
  }
}

module.exports = { verifyToken };
