
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Invoice } from '@/hooks/useInvoices';

export const useAdminInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure proper type casting to maintain status type
      const typedInvoices = (data || []).map(invoice => ({
        ...invoice,
        status: invoice.status as 'pending' | 'paid' | 'cancelled' | 'overdue'
      }));
      
      setInvoices(typedInvoices);
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
        
        // Simulação de geração de PDF
        setTimeout(() => {
          toast.success('Fatura pronta para download');
          
          // Em um ambiente real, isso seria substituído pela URL real do PDF
          const mockPdfUrl = `${window.location.origin}/invoices/download/${invoiceId}`;
          window.open(mockPdfUrl, '_blank');
          
          // Atualizar o registro da fatura com a URL de download
          supabase
            .from('invoices')
            .update({ download_url: mockPdfUrl })
            .eq('id', invoiceId);
        }, 2000);
      }
    } catch (error: any) {
      toast.error('Erro ao baixar fatura: ' + error.message);
    }
  };
  
  const deleteInvoice = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);
        
      if (error) throw error;
      
      toast.success('Fatura excluída com sucesso');
      fetchInvoices();
    } catch (error: any) {
      toast.error('Erro ao excluir fatura: ' + error.message);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    isLoading,
    fetchInvoices,
    downloadInvoice,
    deleteInvoice
  };
};
