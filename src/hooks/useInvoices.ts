
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { executeQuery } from '@/utils/database';

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
      
      // For production environment
      const result = await executeQuery(
        `SELECT * FROM invoices WHERE user_id = $1 ORDER BY created_at DESC`,
        [user.id]
      );
      
      if (result.success) {
        // Ensure proper type casting to maintain status type
        const typedInvoices: Invoice[] = (result.data || []).map((invoice: any) => ({
          ...invoice,
          status: invoice.status as 'pending' | 'paid' | 'cancelled' | 'overdue',
          items: Array.isArray(invoice.items) ? invoice.items : []
        }));
        
        setInvoices(typedInvoices);
      } else {
        throw new Error(result.error || 'Erro ao buscar faturas');
      }
    } catch (error: any) {
      toast.error('Erro ao carregar faturas: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      const result = await executeQuery(
        `SELECT invoice_number, download_url FROM invoices WHERE id = $1`,
        [invoiceId]
      );

      if (!result.success || !result.data?.[0]) {
        throw new Error(result.error || 'Erro ao buscar detalhes da fatura');
      }
      
      const invoiceData = result.data[0];
      
      if (invoiceData.download_url) {
        // Se já temos uma URL de download, usá-la
        window.open(invoiceData.download_url, '_blank');
      } else {
        // Criar PDF e obter URL (isso seria implementado no backend)
        toast.info('Gerando PDF da fatura...');
        
        // Chamar endpoint para gerar o PDF
        const pdfResult = await executeQuery(
          `SELECT generate_invoice_pdf($1) as download_url`,
          [invoiceId]
        );
        
        if (pdfResult.success && pdfResult.data?.[0]?.download_url) {
          window.open(pdfResult.data[0].download_url, '_blank');
        } else {
          throw new Error('Não foi possível gerar o PDF da fatura');
        }
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
