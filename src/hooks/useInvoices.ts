
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchInvoices = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setInvoices(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar faturas: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number, download_url')
        .eq('id', invoiceId)
        .single();

      if (error) throw error;
      
      if (data.download_url) {
        // Se já temos uma URL de download, usá-la
        window.open(data.download_url, '_blank');
      } else {
        // Criar PDF e obter URL
        toast.info('Gerando PDF da fatura...');
        
        // Aqui você chamaria sua API para gerar o PDF
        // E depois atualizaria a URL de download no banco de dados
        
        // Simulação de geração de PDF
        setTimeout(() => {
          toast.success('Fatura pronta para download');
          // Aqui você abriria a nova URL do PDF
        }, 2000);
      }
    } catch (error: any) {
      toast.error('Erro ao baixar fatura: ' + error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvoices();
    } else {
      setInvoices([]);
      setIsLoading(false);
    }
  }, [user]);

  return {
    invoices,
    isLoading,
    fetchInvoices,
    downloadInvoice
  };
};
