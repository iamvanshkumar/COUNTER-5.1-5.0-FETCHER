// test-db.js
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const config = JSON.parse(fs.readFileSync(path.resolve('dbConfig.json'), 'utf8')).insightsFetcher;

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      host: config.host,
      port: Number(config.port),
      user: config.username,
      password: config.password,
      database: config.database,
    });
    console.log('Connected successfully to insightsFetcher DB!');
    await conn.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

testConnection();
