import express from 'express';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

const router = express.Router();



const configPath = path.resolve('./dbConfig.json');
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = configData.insightsFetcher;

const db = mysql.createPool({
  host: config.host,
  port: Number(config.port),
  user: config.username,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


router.post('/api/insertReport', async (req, res) => {
  try {
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty rows data' });
    }



    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    const tableName = `${rows[0].Report_Type}_Report_${timestamp}`;

    const createTableSQL = `
      CREATE TABLE \`${tableName}\` (
        id INT AUTO_INCREMENT PRIMARY KEY,
        \`Institution_Code\` VARCHAR(150),
        \`pub_code\` VARCHAR(1500),
        \`Title\` VARCHAR(3000),
        \`Publisher\` VARCHAR(1500),
        \`Publisher_ID\` VARCHAR(135),
        \`Platform\` VARCHAR(1500),
        \`Collection_Platform\` VARCHAR(1500),
        \`Report_Type\` VARCHAR(30),
        \`DOI\` VARCHAR(1500),
        \`Proprietary_Identifier\` VARCHAR(1500),
        \`ISBN\` VARCHAR(135),
        \`Print_ISSN\` VARCHAR(135),
        \`Online_ISSN\` VARCHAR(135),
        \`URI\` VARCHAR(135),
        \`Metric_Type\` VARCHAR(150),
        \`Counter_Complaint\` VARCHAR(15),
        \`Year\` INT,
        \`Month\` INT,
        \`YTD\` INT,
        \`Jan\` INT, \`Feb\` INT, \`Mar\` INT, \`Apr\` INT, \`May\` INT, \`Jun\` INT,
        \`Jul\` INT, \`Aug\` INT, \`Sep\` INT, \`Oct\` INT, \`Nov\` INT, \`Dec\` INT,
        \`YOP\` VARCHAR(33),
        \`Data_Type\` VARCHAR(150),
        \`Access_Type\` VARCHAR(150),
        \`Access_Method\` VARCHAR(150),
        \`Section_Type\` VARCHAR(300)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `;
    await db.query(createTableSQL);

    const insertSQL = `
      INSERT INTO \`${tableName}\` (
        Institution_Code, pub_code, Title, Publisher, Publisher_ID,
        Platform, Collection_Platform, Report_Type, DOI, Proprietary_Identifier,
        ISBN, Print_ISSN, Online_ISSN, URI, Metric_Type,
        Counter_Complaint, Year, Month, YTD,
        Jan, Feb, Mar, Apr, May, Jun,
        Jul, Aug, Sep, Oct, Nov, \`Dec\`,
        YOP, Data_Type, Access_Type, Access_Method, Section_Type
      ) VALUES ?
    `;

    const values = rows.map(row => [
      row.Institution_Code, row.pub_code, row.Title, row.Publisher, row.Publisher_ID,
      row.Platform, row.Collection_Platform, row.Report_Type, row.DOI, row.Proprietary_Identifier,
      row.ISBN, row.Print_ISSN, row.Online_ISSN, row.URI, row.Metric_Type,
      row.Counter_Complaint,
      row.Year || null, row.Month || null, row.YTD || null,
      row.Jan || null, row.Feb || null, row.Mar || null, row.Apr || null, row.May || null, row.Jun || null,
      row.Jul || null, row.Aug || null, row.Sep || null, row.Oct || null, row.Nov || null, row.Dec || null,
      row.YOP, row.Data_Type, row.Access_Type, row.Access_Method, row.Section_Type
    ]);

    await db.query(insertSQL, [values]);

    res.status(200).json({ message: 'Data inserted successfully', tableName });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Error inserting data', error: err.message });
  }
});

// Route for getting the count of all tables in the database
router.get('/api/tables/count', async (_, res) => {
  try {
    // Query to get all table names in the database
    const query = 'SHOW TABLES';
    const [tables] = await db.query(query);

    // The number of tables is the length of the result array
    const tableCount = tables.length;

    res.status(200).json({ count: tableCount });
  } catch (err) {
    console.error('Error fetching table count:', err);  // Log the error for better visibility
    res.status(500).json({ message: 'Error fetching table count', error: err.message });
  }
});

// Route for getting all table names in the database
router.get('/api/tables/names', async (_, res) => {
  try {
    const query = 'SHOW TABLES';
    const [tables] = await db.query(query);

    // Fetch all table names without any limit
    const tableNames = tables.map((row) => Object.values(row)[0]);

    res.status(200).json({ tableNames });
  } catch (err) {
    console.error('Error fetching table names:', err);
    res.status(500).json({ message: 'Error fetching table names', error: err.message });
  }
});


router.get('/api/table/:tableName', async (req, res) => {
  const tableName = req.params.tableName;

  try {
    const [rows] = await db.query(`SELECT * FROM \`${tableName}\` `);
    res.json({ rows });
    console.log
  } catch (err) {
    console.error(`Error fetching data for table ${tableName}:`, err);
    res.status(500).json({ message: 'Failed to fetch table data', error: err.message });
  }
});


export default router;