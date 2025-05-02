
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
  // First check if there's an explicit URL provided via environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // For specific domain configurations
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production configurations
    if (hostname === 'deve.angohost.ao') {
      return 'https://deve.angohost.ao/api';
    }
    
    if (hostname === 'www.angohost.ao') {
      return 'https://www.angohost.ao/api';
    }

    if (hostname === 'consulta.angohost.ao') {
      return 'https://consulta.angohost.ao/api';
    }
    
    // Default to current origin + /api for any environment
    return window.location.origin + '/api';
  }
  
  // Fallback to local API
  return '/api';
};

/**
 * Test the database connection through a server endpoint
 */
export const testDatabaseConnection = async (): Promise<QueryResult> => {
  try {
    const apiUrl = getApiBaseUrl();
    console.log('Testando conexão com o banco de dados usando URL:', apiUrl);
    
    // Use a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${apiUrl}/db/test-connection`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Status da resposta:', response.status);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      // If HTML instead of JSON (common in production server errors)
      if (contentType && contentType.includes('text/html')) {
        console.error('Recebido HTML em vez de JSON');
        throw new Error(`Erro do servidor (${response.status}): endpoint retornou HTML em vez de JSON`);
      }
      
      // Try to get error details in JSON format
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      } catch (jsonError) {
        // If JSON parsing fails, use default message
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
    }
    
    // Process successful response
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
    const apiUrl = getApiBaseUrl();
    console.log('Executando consulta usando URL:', apiUrl);
    console.log('Consulta:', query);
    console.log('Parâmetros:', params);
    
    // Use a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    const response = await fetch(`${apiUrl}/db/execute-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ query, params }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log('Status da resposta:', response.status);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      // If HTML instead of JSON (common in production server errors)
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        console.error('Recebido HTML em vez de JSON:', text.substring(0, 100) + '...');
        throw new Error(`Erro do servidor (${response.status}): endpoint retornou HTML em vez de JSON`);
      }
      
      // Try to get error details in JSON format
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      } catch (jsonError) {
        // If JSON parsing fails, use default message
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
    }
    
    // Process successful response
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

// Configuração para PDF de faturas no formato A4
export const invoicePdfConfig = {
  format: 'A4',
  width: '210mm',
  height: '297mm',
  margin: {
    top: '20mm',
    bottom: '20mm',
    left: '15mm',
    right: '15mm'
  }
};
