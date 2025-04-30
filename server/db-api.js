
/**
 * This is a Node.js server example to handle database requests
 * You would need to run this separately from your Vite app
 * 
 * To use this:
 * 1. Install Express: npm install express cors pg
 * 2. Run with: node server/db-api.js
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  host: 'emhtcellotyoasg.clouds2africa.com',
  port: 1874,
  user: 'postgres',
  password: 'Bayathu60@@',
  database: 'appdb',
  ssl: false // Set to true if your database requires SSL
});

// Test connection endpoint
app.get('/db/test-connection', async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT 1 as connected');
      res.json({
        success: true,
        data: result.rows[0],
        message: "Conexão com o banco de dados bem-sucedida!"
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao testar conexão com o banco de dados:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Execute query endpoint
app.post('/db/execute-query', async (req, res) => {
  const { query, params } = req.body;
  
  // Basic security check - in production you'd want more validation
  if (!query) {
    return res.status(400).json({ 
      success: false, 
      error: 'Query não fornecida'
    });
  }
  
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      res.json({
        success: true,
        data: result.rows,
        rowCount: result.rowCount
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao executar consulta:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
