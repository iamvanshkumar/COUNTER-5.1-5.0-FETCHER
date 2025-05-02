import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

// Middleware for JSON and URL-encoded payloads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());

// === Login Route ===
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const query = 'SELECT * FROM users WHERE email = ? AND PASSWORD = ?';
    const [rows] = await pool.query(query, [email, password]);

    if (rows.length > 0) {
      return res.status(200).json({ message: 'Login successful', user: rows[0] });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
});

// === Get User by Email ===
app.get('/api/user/email/:email', async (req, res) => {
  const email = decodeURIComponent(req.params.email);
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user by email:', err);
    res.status(500).json({ error: err.message });
  }
});

// === Update User ===
app.put('/api/userUpdate/email/:email', async (req, res) => {
  const { email } = req.params;
  const { username } = req.body;
  const { PASSWORD } = req.body;

  try {
    await pool.query('UPDATE users SET username = ?, PASSWORD = ? WHERE email = ?', [username, PASSWORD, email]);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: err.message });
  }
});


// === Insert TR Report and Create Table ===

app.post('/api/insertReport', async (req, res) => {
  try {
    const { rows } = req.body;
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

    // Create table
    await pool.query(createTableSQL);

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
      row.Year || null,
      row.Month || null,
      row.YTD || null,
      row.Jan || null, row.Feb || null, row.Mar || null, row.Apr || null, row.May || null, row.Jun || null,
      row.Jul || null, row.Aug || null, row.Sep || null, row.Oct || null, row.Nov || null, row.Dec || null,
      row.YOP, row.Data_Type, row.Access_Type, row.Access_Method, row.Section_Type
    ]);
    await pool.query(insertSQL, [values]);

    res.status(200).json({ message: 'Data inserted successfully', tableName });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Error inserting data', error: err.message });
  }
});

// === Start Server ===
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
