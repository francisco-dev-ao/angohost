/**
 * Database utility functions for browser environment
 * Uses fetch API to call server endpoints instead of direct pg connection
 */

import { supabase } from "@/integrations/supabase/client";

interface QueryResult {
  success: boolean;
  data?: any[];
  rowCount?: number;
  count?: number;
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
 * Test the database connection using Supabase Edge Functions
 */
export const testDatabaseConnection = async (): Promise<QueryResult> => {
  try {
    console.log('Testando conexão com o banco de dados via Supabase');
    
    // Use a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // First try with the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('db-test-connection', {
      method: 'GET',
    });
    
    clearTimeout(timeoutId);
    
    if (error) {
      console.error('Erro ao testar conexão via Supabase:', error);
      throw error;
    }
    
    return data as QueryResult;
  } catch (supabaseErr) {
    console.error('Falha na conexão Supabase, tentando API de backup:', supabaseErr);
    
    try {
      const apiUrl = getApiBaseUrl();
      console.log('Testando conexão com o banco de dados usando URL de backup:', apiUrl);
      
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
      console.log('Status da resposta de backup:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      
      const result = await response.json();
      return result;
    } catch (backupErr: any) {
      console.error('Erro ao testar conexão com o banco de dados de backup:', backupErr);
      return { 
        success: false, 
        error: backupErr.message || 'Erro na conexão com o servidor'
      };
    }
  }
};

/**
 * Execute a database operation through Supabase Edge Function
 */
export const executeOperation = async (
  table: string, 
  action: 'select' | 'insert' | 'update' | 'delete',
  filter?: Record<string, any>,
  data?: Record<string, any>
): Promise<QueryResult> => {
  try {
    console.log(`Executando operação ${action} na tabela ${table}`);
    
    // Use a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    // Execute operation via Supabase Edge Function
    const { data: responseData, error } = await supabase.functions.invoke('db-execute-query', {
      method: 'POST',
      body: { table, action, filter, data }
    });
    
    clearTimeout(timeoutId);
    
    if (error) {
      console.error('Erro ao executar operação via Supabase:', error);
      throw error;
    }
    
    return responseData as QueryResult;
  } catch (supabaseErr) {
    console.error('Falha na conexão Supabase, tentando API de backup:', supabaseErr);
    
    // Fallback to legacy API endpoint
    try {
      const apiUrl = getApiBaseUrl();
      console.log('Executando operação usando API de backup:', apiUrl);
      
      // Transform the operation into a SQL query (simplified)
      let query = '';
      let params: any[] = [];
      
      switch (action) {
        case 'select':
          query = `SELECT * FROM ${table}`;
          break;
        default:
          throw new Error(`Operação ${action} não suportada no fallback`);
      }
      
      // Execute via legacy API
      return await executeQuery(query, params);
    } catch (backupErr: any) {
      console.error('Erro ao executar operação de backup:', backupErr);
      return { 
        success: false, 
        error: backupErr.message || 'Erro na execução da operação'
      };
    }
  }
};

/**
 * Legacy: Execute a SQL query through a server endpoint
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
      throw new Error(`Erro HTTP! Status: ${response.status}`);
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
