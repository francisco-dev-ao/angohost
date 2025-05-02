
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
    const { table, action, filter, data } = await req.json();
    
    if (!table || !action) {
      throw new Error("Parâmetros insuficientes: table e action são obrigatórios");
    }

    console.log(`Executando ${action} na tabela ${table}`);
    
    let result;
    
    switch (action) {
      case 'select':
        // Select data from the specified table with optional filter
        result = await supabase
          .from(table)
          .select(filter?.select || '*')
          .order(filter?.orderBy || 'created_at', { ascending: false });
        
        if (filter?.eq) {
          for (const [column, value] of Object.entries(filter.eq)) {
            result = result.eq(column, value);
          }
        }
        
        if (filter?.limit) {
          result = result.limit(filter.limit);
        }
        
        break;
      
      case 'insert':
        // Insert data into the specified table
        result = await supabase
          .from(table)
          .insert(data);
        break;
      
      case 'update':
        // Update data in the specified table
        if (!filter?.eq) {
          throw new Error("Filtro necessário para atualização");
        }
        
        result = await supabase
          .from(table)
          .update(data);
        
        for (const [column, value] of Object.entries(filter.eq)) {
          result = result.eq(column, value);
        }
        
        break;
      
      case 'delete':
        // Delete data from the specified table
        if (!filter?.eq) {
          throw new Error("Filtro necessário para exclusão");
        }
        
        result = await supabase
          .from(table)
          .delete();
        
        for (const [column, value] of Object.entries(filter.eq)) {
          result = result.eq(column, value);
        }
        
        break;
      
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }
    
    if (result.error) {
      throw result.error;
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        data: result.data,
        count: result.count,
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error) {
    console.error("Erro ao executar operação no banco de dados:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Erro ao executar operação no banco de dados", 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
});
