
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'overdue';
  due_date: string;
  payment_date?: string;
  items: any[];
  created_at: string;
  updated_at?: string;
  order_id: string;
  download_url?: string;
  client_details?: any;
  company_details?: any;
}

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
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
      
      // Ensure proper type casting to maintain status type
      const typedInvoices: Invoice[] = (data || []).map(invoice => ({
        ...invoice,
        status: invoice.status as 'pending' | 'paid' | 'cancelled' | 'overdue',
        items: Array.isArray(invoice.items) ? invoice.items : []
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
