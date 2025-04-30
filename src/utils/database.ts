
import { Pool } from 'pg';

// Configuração do pool de conexão com o PostgreSQL
const pool = new Pool({
  host: 'emhtcellotyoasg.clouds2africa.com',
  port: 1874,
  user: 'postgres',
  password: 'Bayathu60@@',
  database: 'appdb',
  ssl: false // Altere para true se seu banco de dados exigir SSL
});

/**
 * Função utilitária para testar a conexão com o banco de dados PostgreSQL
 */
export const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT 1 as connected');
      return { 
        success: true, 
        data: result.rows[0],
        message: "Conexão com o banco de dados bem-sucedida!" 
      };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao testar conexão com o banco de dados:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Função para executar consultas SQL personalizadas
 */
export const executeQuery = async (query: string, params?: any[]) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      return { 
        success: true, 
        data: result.rows,
        rowCount: result.rowCount 
      };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Erro ao executar consulta:', err);
    return { success: false, error: err.message };
  }
};
