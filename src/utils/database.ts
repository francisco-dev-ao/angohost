
/**
 * Database utility functions for browser environment
 * Uses fetch API to call server endpoints instead of direct pg connection
 */

interface QueryResult {
  success: boolean;
  data?: any[];
  rowCount?: number;
  error?: string;
  message?: string;
}

/**
 * Test the database connection through a server endpoint
 */
export const testDatabaseConnection = async (): Promise<QueryResult> => {
  try {
    const response = await fetch('/api/db/test-connection');
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (err: any) {
    console.error('Erro ao testar conexão com o banco de dados:', err);
    return { 
      success: false, 
      error: err.message || 'Erro na conexão com o servidor'
    };
  }
};

/**
 * Execute a SQL query through a server endpoint
 */
export const executeQuery = async (query: string, params?: any[]): Promise<QueryResult> => {
  try {
    const response = await fetch('/api/db/execute-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (err: any) {
    console.error('Erro ao executar consulta:', err);
    return { 
      success: false, 
      error: err.message || 'Erro na execução da consulta'
    };
  }
};

// Mock implementation for local development/testing
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  console.warn('Using mock database implementation for development');
  
  // Mocks for testing UI without backend
  (window as any).__mockDbResponses = {
    testConnection: { 
      success: true, 
      data: { connected: 1 },
      message: "Conexão com o banco de dados simulada (dev mode)" 
    },
    executeQuery: { 
      success: true, 
      data: [],
      rowCount: 0
    }
  };
}
