// server/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Devans@99978',
  database: 'fetcher_db',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
