
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
  }
  
  // In development, use the proxy from Vite
  if (import.meta.env.DEV) {
    return '/api';
  }

  // In production, use the relative path or current URL base
  const currentUrl = window.location.origin;
  return `${currentUrl}/api`;
};

/**
 * Test the database connection through a server endpoint
 */
export const testDatabaseConnection = async (): Promise<QueryResult> => {
  try {
    const apiUrl = getApiBaseUrl();
    console.log('Testando conexão com o banco de dados usando URL:', apiUrl);
    
    // For mock database in development
    if (import.meta.env.DEV && 
        import.meta.env.VITE_USE_MOCK_DB === 'true' && 
        typeof window !== 'undefined' && 
        (window as any).__mockDbResponses) {
      console.log('Usando simulação de banco de dados para desenvolvimento');
      return (window as any).__mockDbResponses.testConnection;
    }
    
    const response = await fetch(`${apiUrl}/db/test-connection`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
    });
    
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
    
    // For mock database in development
    if (import.meta.env.DEV && 
        import.meta.env.VITE_USE_MOCK_DB === 'true' && 
        typeof window !== 'undefined' && 
        (window as any).__mockDbResponses) {
      console.log('Usando simulação de banco de dados para desenvolvimento');
      
      // Simular sucesso nas operações comuns em modo de desenvolvimento
      if (query.toLowerCase().includes('select') && query.toLowerCase().includes('profiles')) {
        return {
          success: true,
          data: [{
            full_name: "Cliente de Teste",
            email: "cliente@exemplo.com",
            phone: "+244 923 456 789",
            address: "Luanda, Angola"
          }],
          rowCount: 1
        };
      }
      
      if (query.toLowerCase().includes('select') && query.toLowerCase().includes('payment_methods')) {
        return {
          success: true,
          data: [{
            id: "bank_transfer_default",
            name: "Transferência Bancária",
            is_active: true,
            payment_type: "bank_transfer",
            description: "Pague por transferência bancária e envie o comprovante"
          }],
          rowCount: 1
        };
      }
      
      // Simular dados para faturas
      if (query.toLowerCase().includes('select') && query.toLowerCase().includes('invoices')) {
        return {
          success: true,
          data: [{
            id: "1",
            user_id: "user123",
            invoice_number: "INV-20250502-1234",
            amount: 15000,
            status: "pending",
            due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            items: [{
              title: "Domínio exemplo.ao",
              price: 15000,
              quantity: 1
            }],
            created_at: new Date().toISOString(),
            order_id: "order123"
          }],
          rowCount: 1
        };
      }
      
      // Dados simulados para domínios
      if (query.toLowerCase().includes('select') && query.toLowerCase().includes('domains')) {
        return {
          success: true,
          data: [{
            id: "domain1",
            domain_name: "exemplo.ao",
            status: "active",
            expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            auto_renew: true,
            is_locked: true,
            whois_privacy: true
          }],
          rowCount: 1
        };
      }
      
      return {
        success: true,
        data: [],
        rowCount: 0
      };
    }
    
    const response = await fetch(`${apiUrl}/db/execute-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ query, params }),
    });
    
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

// Simulated implementation for local development
if (import.meta.env.DEV && typeof window !== 'undefined') {
  console.log('Usando implementação de banco de dados para ambiente:', import.meta.env.MODE);
  
  // Use mocks only if explicitly configured or if we're in development mode
  if (import.meta.env.VITE_USE_MOCK_DB === 'true' || import.meta.env.DEV) {
    console.warn('Usando implementação simulada de banco de dados para desenvolvimento');
    
    // Mocks to test UI without backend
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
