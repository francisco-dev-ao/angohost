
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Pool } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Conexão segura usando o segredo armazenado no Supabase
    const databaseUrl = Deno.env.get('DATABASE_URL');
    
    if (!databaseUrl) {
      throw new Error("String de conexão de banco de dados não encontrada");
    }

    const pool = new Pool(databaseUrl, 3, true);
    
    // Teste de conexão
    const connection = await pool.connect();
    
    try {
      // Consulta básica para testar
      const result = await connection.queryObject`SELECT 1 as connected`;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Conexão com o banco de dados bem-sucedida!", 
          data: result.rows[0]
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    } finally {
      connection.release();
      await pool.end();
    }
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Erro ao conectar ao banco de dados", 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
