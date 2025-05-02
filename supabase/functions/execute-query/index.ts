
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
    // Receber a consulta SQL e parâmetros da requisição
    const { query, params } = await req.json();
    
    if (!query) {
      throw new Error("Consulta SQL não fornecida");
    }

    // Conexão direta usando configurações do ambiente AngoHost
    const databaseUrl = Deno.env.get('DATABASE_URL') || 
      "postgres://angohost_bd2:Bayathu60@@consulta.angohost.ao:5432/angohost_bd2";
    
    const pool = new Pool(databaseUrl, 3, true);
    const connection = await pool.connect();
    
    try {
      // Executar a consulta SQL com os parâmetros fornecidos
      let result;
      
      if (params && Array.isArray(params)) {
        // Preparar e executar a consulta com parâmetros
        const client = connection.client;
        result = await client.queryObject(query, params);
      } else {
        // Executar a consulta sem parâmetros
        result = await connection.queryObject(query);
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: result.rows,
          rowCount: result.rowCount 
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
    console.error("Erro ao executar consulta:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Erro ao executar consulta", 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
