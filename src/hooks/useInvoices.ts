
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
      
      // For development or preview environments
      if (import.meta.env.DEV || window.location.hostname.includes('lovable.app')) {
        setTimeout(() => {
          const mockInvoices: Invoice[] = [
            {
              id: "1",
              user_id: user.id,
              invoice_number: "INV-20250502-1234",
              amount: 15000,
              status: 'pending',
              due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
              items: [{
                title: "Domínio exemplo.ao",
                price: 15000,
                quantity: 1
              }],
              created_at: new Date().toISOString(),
              order_id: "order123",
              download_url: "#"
            }
          ];
          setInvoices(mockInvoices);
          setIsLoading(false);
        }, 800);
        return;
      }
      
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
      // For development or preview environments, show a simulated download
      if (import.meta.env.DEV || window.location.hostname.includes('lovable.app')) {
        toast.info('Gerando PDF da fatura (simulação)...');
        
        setTimeout(() => {
          toast.success('Fatura pronta para download (simulação)');
          
          // Simular download abrindo uma nova janela
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(`
              <html>
                <head>
                  <title>Fatura INV-20250502-1234</title>
                </head>
                <body style="font-family: Arial, sans-serif; margin: 40px;">
                  <div style="max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea;">
                    <div style="text-align: center; margin-bottom: 30px;">
                      <h1>FATURA</h1>
                      <p>AngoHost - Serviços de Tecnologia</p>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                      <div>
                        <p><strong>Cliente:</strong> Cliente de Teste</p>
                        <p><strong>Email:</strong> cliente@exemplo.com</p>
                        <p><strong>Telefone:</strong> +244 923 456 789</p>
                      </div>
                      <div>
                        <p><strong>Fatura:</strong> INV-20250502-1234</p>
                        <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
                        <p><strong>Vencimento:</strong> ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                      <thead>
                        <tr style="background-color: #f2f2f2;">
                          <th style="padding: 10px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                          <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Quantidade</th>
                          <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Preço</th>
                          <th style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style="padding: 10px; border-bottom: 1px solid #ddd;">Domínio exemplo.ao</td>
                          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">1</td>
                          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">15.000 Kz</td>
                          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">15.000 Kz</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                          <td style="padding: 10px; text-align: right;"><strong>15.000 Kz</strong></td>
                        </tr>
                      </tfoot>
                    </table>
                    
                    <div style="margin-top: 40px; text-align: center;">
                      <p>Esta é uma fatura simulada para fins de demonstração.</p>
                    </div>
                  </div>
                </body>
              </html>
            `);
            newWindow.document.close();
          }
        }, 1500);
        return;
      }
      
      // For production environment
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
