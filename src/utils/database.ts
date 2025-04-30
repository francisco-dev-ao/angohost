
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

// Get the API URL based on the environment
const getApiBaseUrl = (): string => {
  if (import.meta.env.MODE === 'development') {
    return '/api'; // Uses Vite's proxy in development
  }
  // In production, use the environment variable or default to relative path
  return import.meta.env.VITE_API_URL || '/api';
};

/**
 * Test the database connection through a server endpoint
 */
export const testDatabaseConnection = async (): Promise<QueryResult> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/db/test-connection`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // In production, you might need credentials for cookies/auth
      credentials: 'include',
    });
    
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
    const response = await fetch(`${getApiBaseUrl()}/db/execute-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${getAuthToken()}`,
      },
      credentials: 'include',
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
if (import.meta.env.MODE === 'development' && typeof window !== 'undefined') {
  console.log('Using database implementation for environment:', import.meta.env.MODE);
  
  // Only use mocks if explicitly configured or if API is unavailable
  if (import.meta.env.VITE_USE_MOCK_DB === 'true') {
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
}
