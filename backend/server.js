const express = require('express');
const socketIo = require('socket.io'); // Asegúrate de importar socket.io
const setupSocketServer = require('./webSokets/socketManager'); // Importa la lógica de socketManager
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Importa routers
const BasicUserRoutes = require('./routes/BasicUser.routes');
const EncargadoRoutes = require('./routes/Encargado.routes');
const FerianteRoutes = require('./routes/Feriante.routes');
const MunicipalRoutes = require('./routes/Municipal.routes');
const PagosRoutes = require('./routes/Pagos.routes');
const FeedRouter = require('./routes/Feed.routes');
const puestoRoutes = require('./routes/Puesto.routes');
const supervisorRoutes = require('./routes/Supervisor.routes');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Conexión a la base de datos
const pool = require('./auth/pool')

// Uso de middleware
app.use(cors());
app.use(express.json());

// Middleware para inyectar la conexión de la base de datos en cada solicitud
app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Rutas
app.use(BasicUserRoutes);
app.use(FeedRouter);
app.use(EncargadoRoutes);
app.use(FerianteRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(MunicipalRoutes);
app.use(PagosRoutes);
app.use(puestoRoutes);
app.use('/api/supervisor', supervisorRoutes);

// Iniciar el servidor HTTP
const server = app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Configurar Socket.IO en el servidor
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Permitir solo el origen del cliente
    methods: ['GET', 'POST'],       // Métodos permitidos
    allowedHeaders: ['Content-Type'], // Cabeceras permitidas
    credentials: true                // Si necesitas pasar cookies o credenciales
  }
});


// Llamar a la función que maneja las conexiones de Socket.IO
setupSocketServer(io);

