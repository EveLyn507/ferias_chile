// database/db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ferias_chile',
  password: 'A2349.473a',
  port: 5432,
});

module.exports = pool;
