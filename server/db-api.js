
/**
 * This is a Node.js server example to handle database requests
 * You would need to run this separately from your Vite app
 * 
 * To use this:
 * 1. Install Express: npm install express cors pg dotenv
 * 2. Create a .env file with your database credentials
 * 3. Run with: node server/db-api.js
 */

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get database configuration from environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'emhtcellotyoasg.clouds2africa.com',
  port: parseInt(process.env.DB_PORT || '1874'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'appdb',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  // In production, you should use a proper SSL configuration
  // ssl: {
  //   rejectUnauthorized: false,
  //   ca: fs.readFileSync('/path/to/server-ca.pem').toString(),
  //   key: fs.readFileSync('/path/to/client-key.pem').toString(),
  //   cert: fs.readFileSync('/path/to/client-cert.pem').toString(),
  // },
  max: 20, // Connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
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

// Execute query endpoint with security enhancements
app.post('/db/execute-query', async (req, res) => {
  const { query, params } = req.body;
  
  // Basic security check - in production you'd want more validation
  if (!query) {
    return res.status(400).json({ 
      success: false, 
      error: 'Query não fornecida'
    });
  }
  
  // Prevent dangerous operations
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('drop ') || 
      lowerQuery.includes('truncate ') ||
      lowerQuery.includes('delete ') && !lowerQuery.includes('where')) {
    return res.status(403).json({
      success: false,
      error: 'Operação não permitida por razões de segurança'
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

// Process graceful shutdown
process.on('SIGINT', () => {
  pool.end().then(() => {
    console.log('Pool de conexões do banco de dados encerrado');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
