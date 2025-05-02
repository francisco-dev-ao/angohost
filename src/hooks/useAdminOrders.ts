
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '@/types/admin';

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [singleOrder, setSingleOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedOrders: Order[] = data.map(o => ({
        id: o.id,
        userId: o.user_id,
        orderNumber: o.order_number,
        totalAmount: o.total_amount,
        status: o.status as Order['status'],
        items: Array.isArray(o.items) ? o.items : [], // Ensure items is an array
        createdAt: o.created_at,
        updatedAt: o.updated_at
      }));
      
      setOrders(formattedOrders);
    } catch (error: any) {
      toast.error('Erro ao carregar pedidos: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderById = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      
      const formattedOrder: Order = {
        id: data.id,
        userId: data.user_id,
        orderNumber: data.order_number,
        totalAmount: data.total_amount,
        status: data.status as Order['status'],
        items: Array.isArray(data.items) ? data.items : [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setSingleOrder(formattedOrder);
      return formattedOrder;
    } catch (error: any) {
      toast.error('Erro ao carregar detalhes do pedido: ' + error.message);
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success(`Status do pedido atualizado para ${getStatusText(status)}`);
      fetchOrders();
    } catch (error: any) {
      toast.error('Erro ao atualizar status do pedido: ' + error.message);
    }
  };

  const approveOrder = async (orderId: string) => {
    return updateOrderStatus(orderId, 'completed');
  };

  const processOrder = async (orderId: string) => {
    return updateOrderStatus(orderId, 'processing');
  };

  const cancelOrder = async (orderId: string) => {
    return updateOrderStatus(orderId, 'canceled');
  };

  const createOrder = async (orderData: {
    userId: string;
    items: any[];
    totalAmount: number;
  }) => {
    try {
      // Generate a unique order number (current timestamp + random string)
      const timestamp = new Date().getTime();
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      const orderNumber = `ORD-${timestamp}-${randomStr}`;
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.userId,
          order_number: orderNumber,
          total_amount: orderData.totalAmount,
          status: 'pending',
          items: orderData.items
        })
        .select('*')
        .single();

      if (error) throw error;
      
      toast.success('Pedido criado com sucesso');
      fetchOrders();
      
      return data;
    } catch (error: any) {
      toast.error('Erro ao criar pedido: ' + error.message);
      throw error;
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success('Pedido excluído com sucesso');
      fetchOrders();
    } catch (error: any) {
      toast.error('Erro ao excluir pedido: ' + error.message);
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'canceled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { 
    orders, 
    singleOrder,
    isLoading, 
    fetchOrders, 
    fetchOrderById,
    updateOrderStatus,
    approveOrder,
    processOrder,
    cancelOrder,
    createOrder,
    deleteOrder,
    getStatusText
  };
};
