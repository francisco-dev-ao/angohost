
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
        status: order.status === 'canceled' ? 'cancelled' : order.status,
        created_at: order.created_at,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
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
