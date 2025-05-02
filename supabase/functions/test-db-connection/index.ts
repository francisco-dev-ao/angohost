
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
    // Conexão direta usando configurações do ambiente AngoHost
    const databaseUrl = Deno.env.get('DATABASE_URL') || 
      "postgres://angohost_bd2:Bayathu60@@consulta.angohost.ao:5432/angohost_bd2";
    
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
