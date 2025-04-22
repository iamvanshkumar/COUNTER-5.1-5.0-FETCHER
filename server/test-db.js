const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'fetcher_user',
      password: 'mps@1234',
      database: 'fetcher_db',
    });

    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    console.log('MySQL test successful:', rows);
  } catch (err) {
    console.error('MySQL test failed:', err.message);
  }
}

testConnection();
