
import { supabase } from '@/integrations/supabase/client';

/**
 * Função utilitária para testar a conexão com o banco de dados PostgreSQL
 * usando a edge function do Supabase
 */
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('test-db-connection');
    
    if (error) {
      console.error('Erro ao testar conexão com o banco de dados:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exceção ao testar conexão com o banco de dados:', err);
    return { success: false, error: err.message };
  }
};

/**
 * Função para executar consultas SQL personalizadas
 * Observação: Esta função depende da edge function que usa a variável DATABASE_URL
 */
export const executeQuery = async (query: string, params?: any[]) => {
  try {
    const { data, error } = await supabase.functions.invoke('execute-query', {
      body: { query, params },
    });
    
    if (error) {
      console.error('Erro ao executar consulta:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exceção ao executar consulta:', err);
    return { success: false, error: err.message };
  }
};
