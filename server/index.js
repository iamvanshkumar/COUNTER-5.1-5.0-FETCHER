import express from 'express';
import cors from 'cors';
import pool from './db.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import counterFetcherRoute from './routes/insightsRoutes.js';


dotenv.config(); // Load environment variables

const app = express();

// Middleware for JSON and URL-encoded payloads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());

const CONFIG_PATH = path.join(process.cwd(), './dbConfig.json');

// GET config
app.use(counterFetcherRoute);

app.get('/api/config', (req, res) => {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH));
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: 'Failed to read config', error: err.message });
  }
});

// POST update config
app.post('/api/config', (req, res) => {
  try {
    const { tool, config } = req.body;

    const fullConfig = fs.existsSync(CONFIG_PATH)
      ? JSON.parse(fs.readFileSync(CONFIG_PATH))
      : {};

    fullConfig[tool] = config;

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(fullConfig, null, 2));
    res.json({ message: 'Configuration saved successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save config', error: err.message });
  }
});

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
  const { username, PASSWORD } = req.body;

  try {
    await pool.query('UPDATE users SET username = ?, PASSWORD = ? WHERE email = ?', [username, PASSWORD, email]);
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: err.message });
  }
});



// === Start Server ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
