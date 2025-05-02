
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Order } from '@/types/client';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*, invoices:invoices(id, invoice_number)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Ensure the data matches our Order type
      const formattedOrders: Order[] = (data || []).map(order => ({
        id: order.id,
        order_number: order.order_number,
        user_id: order.user_id,
        total_amount: order.total_amount,
        // Convert 'canceled' to 'cancelled' to match the expected type
        status: order.status === 'canceled' ? 'cancelled' : order.status as any,
        created_at: order.created_at,
        payment_method: order.payment_method,
        // Map payment_status to one of the allowed values
        payment_status: mapPaymentStatus(order.payment_status),
        client_details: order.client_details || {
          name: '',
          email: '',
          phone: '',
          address: ''
        },
        items: Array.isArray(order.items) ? order.items : [],
        invoice: order.invoices?.[0] ? {
          id: order.invoices[0].id,
          invoice_number: order.invoices[0].invoice_number
        } : undefined
      }));
      
      setOrders(formattedOrders);
    } catch (error: any) {
      toast.error('Erro ao carregar pedidos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to ensure payment_status matches the expected type
  const mapPaymentStatus = (status: string): 'pending' | 'paid' | 'cancelled' => {
    if (status === 'paid') return 'paid';
    if (status === 'cancelled' || status === 'canceled') return 'cancelled';
    return 'pending';
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
      setIsLoading(false);
    }
  }, [user]);

  return { orders, isLoading, fetchOrders };
};
