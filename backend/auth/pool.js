// database/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ferias',
  password: 'Mevr20183',
  port: 5432,
});

module.exports = pool;
