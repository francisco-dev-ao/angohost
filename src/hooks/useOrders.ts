
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
      
      setOrders(data || []);
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
