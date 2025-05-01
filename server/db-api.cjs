
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
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();
console.log('Senha lida do .env:', process.env.DB_PASSWORD);

const app = express();

// Configuração de CORS para produção
const allowedOrigins = [
  'https://deve.angohost.ao',
  'https://www.angohost.ao',
  'http://localhost:8080',
  'http://localhost:3000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origem (como aplicativos móveis ou Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Tratamento global de erros para JSON malformado
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ success: false, error: 'Invalid JSON' });
  }
  next(err);
});

// SSL configuration for production
const sslConfig = process.env.DB_SSL === 'true' 
  ? { 
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
      ca: process.env.DB_SSL_CA ? fs.readFileSync(process.env.DB_SSL_CA).toString() : undefined,
      key: process.env.DB_SSL_KEY ? fs.readFileSync(process.env.DB_SSL_KEY).toString() : undefined,
      cert: process.env.DB_SSL_CERT ? fs.readFileSync(process.env.DB_SSL_CERT).toString() : undefined
    } 
  : false;

// Get database configuration from environment variables with improved validation
const pool = new Pool({
  host: process.env.DB_HOST || 'emhtcellotyoasg.clouds2africa.com',
  port: parseInt(process.env.DB_PORT || '1874'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'appdb',
  ssl: sslConfig,
  max: parseInt(process.env.DB_POOL_MAX || '20'),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
  connectionTimeoutMillis: parseInt(process.env.DB_CONN_TIMEOUT || '5000'),
});

// Verificação inicial de conexão
pool.connect()
  .then(client => {
    console.log('Conexão inicial com o banco de dados bem-sucedida');
    client.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
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
    } catch (err) {
      console.error('Erro ao executar query de teste:', err);
      res.status(500).json({
        success: false,
        error: `Erro ao executar query: ${err.message}`
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao testar conexão com o banco de dados:', err);
    res.status(500).json({
      success: false,
      error: `Falha na conexão: ${err.message}`
    });
  }
});

// Execute query endpoint with security enhancements
app.post('/db/execute-query', async (req, res) => {
  const { query, params } = req.body;
  
  // Basic security check
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
      (lowerQuery.includes('delete ') && !lowerQuery.includes('where'))) {
    return res.status(403).json({
      success: false,
      error: 'Operação não permitida por razões de segurança'
    });
  }
  
  console.log('Executando consulta:', query);
  console.log('Parâmetros:', params);
  
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      console.log('Resultado da consulta:', result.rows);
      res.json({
        success: true,
        data: result.rows,
        rowCount: result.rowCount
      });
    } catch (err) {
      console.error('Erro ao executar consulta:', err);
      res.status(500).json({
        success: false,
        error: err.message
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao conectar para executar consulta:', err);
    res.status(500).json({
      success: false,
      error: `Erro de conexão: ${err.message}`
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Root endpoint para validar que o servidor está rodando
app.get('/', (req, res) => {
  res.json({ 
    message: 'AngoHost API Server funcionando!', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Serve static frontend in production if configured
if (process.env.SERVE_FRONTEND === 'true') {
  const distPath = path.resolve(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    console.log('Servindo arquivos estáticos do frontend de:', distPath);
    app.use(express.static(distPath));
    
    // All other routes should redirect to index.html (SPA)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

// Process graceful shutdown
process.on('SIGINT', () => {
  console.log('Recebido sinal SIGINT, encerrando aplicação...');
  pool.end().then(() => {
    console.log('Pool de conexões do banco de dados encerrado');
    process.exit(0);
  }).catch(err => {
    console.error('Erro ao encerrar pool de conexões:', err);
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('Recebido sinal SIGTERM, encerrando aplicação...');
  pool.end().then(() => {
    console.log('Pool de conexões do banco de dados encerrado');
    process.exit(0);
  }).catch(err => {
    console.error('Erro ao encerrar pool de conexões:', err);
    process.exit(1);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Node environment: ${process.env.NODE_ENV || 'development'}`);
});
