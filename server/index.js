import express from 'express';
import cors from 'cors';
import pool from './db.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import counterFetcherRoute from './routes/insightsRoutes.js';
import winston from 'winston'; // Import winston for logging


dotenv.config(); // Load environment variables

const app = express();

// Middleware for JSON and URL-encoded payloads
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());

const CONFIG_PATH = path.join(process.cwd(), './dbConfig.json');

// Configure winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'server.log' }),
    new winston.transports.Console()
  ]
});

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



// === Save Vendor User ===
app.post('/api/save-vendor', async (req, res) => {
  try {
    const { vendor } = req.body; // Changed from 'vendors' to 'vendor'

    if (!vendor) {
      return res.status(400).json({ message: 'Vendor data is required' });
    }

    const filePath = path.join(process.cwd(), 'vendors.json');
    
    // Read existing vendors if file exists
    let vendors = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      vendors = fileContent.trim() ? JSON.parse(fileContent) : [];
    }

    // Add new vendor to the array
    vendors.push(vendor);

    // Save the updated array
    fs.writeFileSync(filePath, JSON.stringify(vendors, null, 2));

    res.json({ 
      message: 'Vendor saved successfully',
      vendor,
      totalVendors: vendors.length
    });
  } catch (err) {
    console.error('Error saving vendor:', err);
    res.status(500).json({ message: 'Failed to save vendor', error: err.message });
  }
});


// === View All Vendor ===
  app.get("/api/get-vendors", (req, res) => {
    try {
      const filePath = path.join(process.cwd(), "vendors.json");
      if (!fs.existsSync(filePath)) {
        return res.json({ vendors: [] });
      }
      const vendors = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.json({ vendors });
    } catch (err) {
      console.error("Error reading vendors:", err);
      res
        .status(500)
        .json({ message: "Failed to read vendors", error: err.message });
    }
  });


// === Delete Vendor ===
app.delete('/api/vendors/:id', (req, res) => {
  try {
    const vendorId = decodeURIComponent(req.params.id); // Decode the ID
    const filePath = path.join(process.cwd(), 'vendors.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vendors file not found' 
      });
    }

    const vendors = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const vendorIndex = vendors.findIndex(v => v.id === vendorId);

    if (vendorIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: `Vendor with ID ${vendorId} not found` 
      });
    }

    const [deletedVendor] = vendors.splice(vendorIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(vendors, null, 2));

    res.json({ 
      success: true,
      message: 'Vendor deleted successfully',
      deletedVendor
    });
  } catch (err) {
    console.error('Error deleting vendor:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete vendor',
      error: err.message 
    });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  logger.info(`Server started on http://localhost:${PORT}`); // Log server start
});
