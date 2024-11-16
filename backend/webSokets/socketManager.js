// socketManager.js
const { verifyToken } = require('../auth/verifyToken');
const { UpdatePuesto ,CreateNewItemElement  ,UpdatePlano ,DeleteItemPlano} = require('./controllers/wsEnfController');
const { getArriendosFToday} = require('./controllers/FeedFeriasController');

const pool = require('../auth/pool');

const activeSockets = {};

function setupSocketServer(io) {
  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    const token = socket.handshake.auth.token;
    const decoded = verifyToken(token); // Verifica el token

    if (decoded) {
      // Verifica si el usuario ya está conectado
      if (activeSockets[decoded.id]) {
        // Si ya existe una conexión, puedes desconectar el socket anterior
        const existingSocket = activeSockets[decoded.id];
        existingSocket.disconnect(true);
      }

      socket.user = decoded.id;
      activeSockets[decoded.id] = socket; // Almacenar el socket activo

      console.log('Usuario autenticado con ID:', socket.user);

      // Configura el evento de solicitud de datos
      socket.on('UpdatePuesto', (PlanoItemElement) => UpdatePuesto(socket ,pool, PlanoItemElement));
      socket.on('CreateNewItemElement', (newItem) => CreateNewItemElement(socket ,pool, newItem));
      socket.on('UpdatePlano', (UpdatedPlano) => UpdatePlano(socket ,pool, UpdatedPlano));
      socket.on('DeleteItem', (deletedItem) => DeleteItemPlano(socket ,pool, deletedItem));
      socket.on('TodayFeriaElements', (params) => getArriendosFToday(socket ,pool, params));

      socket.emit('message', 'Conectado con el servidor');

      socket.on('disconnect', () => {
        console.log(`Cliente ${socket.id} se ha desconectado`);
        // Elimina el socket de activeSockets cuando se desconecta
        delete activeSockets[socket.user];
      });
    } else {
      console.log('Token no válido o no proporcionado');
      socket.emit('error', 'No autenticado');
    }
  });

  // Manejar la señal SIGINT (Ctrl + C) para desconectar usuarios y apagar el servidor
  process.on('SIGINT', () => {
    console.log('Servidor apagado. Desconectando usuarios...');

    // Desconectar a todos los clientes sin avisarles
    Object.keys(io.sockets.sockets).forEach((socketId) => {
      io.sockets.sockets[socketId].disconnect(true); // Desconectar a cada cliente sin notificación
    });

    // Cerrar el servidor de forma limpia
    io.close(() => {
      console.log('Servidor detenido.');
      process.exit(0); // Salir del proceso de manera segura
    });
  });
}


module.exports = setupSocketServer;
