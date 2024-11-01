const express = require('express');
const { Pool , types} = require('pg');
types.setTypeParser(1083, (val) => val); // Esto devuelve el valor como string, sin converti
const cors = require('cors');
const credencial = require('./credenciales'); // Importa el archivo de configuración
const dotenv = require('dotenv');
const cron = require('node-cron'); // Importar node-cron
const path = require('path');

// Importe de routers
const BasicUserRoutes = require('./routes/BasicUser.routes'); 
const EncargadoRoutes = require('./routes/Encargado.routes'); 
const FerianteRoutes = require('./routes/Feriante.routes');
const MunicipalRoutes = require('./routes/Municipal.routes');
const PagosRoutes = require('./routes/Pagos.routes');
const FeedRouter = require('./routes/Feed.routes');
const puestoRoutes = require('./routes/Puesto.routes')
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


//esta es la conexion a la bd
const pool = new Pool({
  user: credencial.user_name,
  host: credencial.host_name,
  database: credencial.database_name,
  password: credencial.pass,
  port: credencial.puerto // Puerto predeterminado de PostgreSQL
});

//uso de cors que recibe peticiones https
app.use(cors());
app.use(express.json());

//midware , le da el pool a las peticiones para que conecten
app.use((req, res, next) => {
  req.pool = pool; 
  next(); // Pasar al siguiente middleware o ruta
});



// ROUTERS 

// rutas publicas
app.use(BasicUserRoutes); 
app.use(FeedRouter); 

//rutas privadas
app.use(EncargadoRoutes);  // rutas del perfil encargado
app.use(FerianteRoutes);  // rutas del perfil feriante
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));  // foto feriante
app.use(MunicipalRoutes); 
app.use(PagosRoutes); 
app.use(puestoRoutes);



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
