const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');
const usuarioRoutes = require('./routes/user.routes'); // rutas
const puestosRoutes = require('./routes/puestosRoutes'); 
const perfilferianteRoutes = require('./routes/perfilferianteRoutes');
const credencial = require('./credenciales'); // Importa el archivo de configuración
const paymentRoutes = require('./routes/paymentRoutes');

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

//resgistra las rutas en el sv y las saca desde  routes
app.use(usuarioRoutes); 

app.use(puestosRoutes);

app.use(perfilferianteRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/api', paymentRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
