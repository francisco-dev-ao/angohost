
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
  // Verificar primeiro se há uma URL explícita fornecida via variável de ambiente
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Em desenvolvimento, usa o proxy do Vite
  if (import.meta.env.DEV) {
    return '/api';
  }

  // Em produção, usa o caminho relativo ou a URL base do site atual
  const currentUrl = window.location.origin;
  return `${currentUrl}/api`;
};

/**
 * Test the database connection through a server endpoint
 */
export const testDatabaseConnection = async (): Promise<QueryResult> => {
  try {
    console.log('Testando conexão com o banco de dados usando URL:', getApiBaseUrl());
    
    const response = await fetch(`${getApiBaseUrl()}/db/test-connection`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
    });
    
    // Log para debug
    console.log('Status da resposta:', response.status);
    
    // Se não for 2xx, tratar como erro
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      // Se for HTML em vez de JSON (erro comum em servidores de produção)
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        console.error('Recebido HTML em vez de JSON:', text.substring(0, 100) + '...');
        throw new Error(`Erro do servidor (${response.status}): endpoint retornou HTML em vez de JSON`);
      }
      
      // Tentar obter detalhes do erro no formato JSON
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      } catch (jsonError) {
        // Se não for possível analisar como JSON, usar mensagem padrão
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
    }
    
    // Processar resposta bem-sucedida
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
    console.log('Executando consulta usando URL:', getApiBaseUrl());
    console.log('Consulta:', query);
    console.log('Parâmetros:', params);
    
    const response = await fetch(`${getApiBaseUrl()}/db/execute-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ query, params }),
    });
    
    // Log para debug
    console.log('Status da resposta:', response.status);
    
    // Se não for 2xx, tratar como erro
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      
      // Se for HTML em vez de JSON (erro comum em servidores de produção)
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        console.error('Recebido HTML em vez de JSON:', text.substring(0, 100) + '...');
        throw new Error(`Erro do servidor (${response.status}): endpoint retornou HTML em vez de JSON`);
      }
      
      // Tentar obter detalhes do erro no formato JSON
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      } catch (jsonError) {
        // Se não for possível analisar como JSON, usar mensagem padrão
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
    }
    
    // Processar resposta bem-sucedida
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

// Implementação simulada para desenvolvimento local
if (import.meta.env.DEV && typeof window !== 'undefined') {
  console.log('Usando implementação de banco de dados para ambiente:', import.meta.env.MODE);
  
  // Usar mocks apenas se explicitamente configurado
  if (import.meta.env.VITE_USE_MOCK_DB === 'true') {
    console.warn('Usando implementação simulada de banco de dados para desenvolvimento');
    
    // Mocks para testar UI sem backend
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
