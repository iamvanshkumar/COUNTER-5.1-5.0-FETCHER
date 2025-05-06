// server/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'fetcher_user',
  password: 'your_password',
  database: 'fetcher_db',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
