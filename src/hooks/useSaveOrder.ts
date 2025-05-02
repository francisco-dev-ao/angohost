
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export const useSaveOrder = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useSupabaseAuth();
  const { items, clearCart } = useCart();
  
  const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  };

  const saveCartAsOrder = async (orderData?: {
    paymentMethodId?: string;
    clientDetails?: any;
    skipPayment?: boolean;
  }) => {
    if (!user) {
      toast.error('Você precisa estar logado para salvar o pedido');
      return null;
    }
    
    if (items.length === 0) {
      toast.error('Seu carrinho está vazio');
      return null;
    }

    try {
      setIsSaving(true);
      const orderNumber = generateOrderNumber();
      const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      // Mark any abandoned cart as recovered
      if (user) {
        try {
          await supabase
            .from('cart_abandonments')
            .update({ 
              is_recovered: true,
              recovered_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('is_recovered', false);
        } catch (e) {
          // Non-critical, just log the error
          console.error('Failed to mark cart as recovered:', e);
        }
      }
      
      // Default to bank transfer if no payment method is selected
      let paymentMethodValue = orderData?.paymentMethodId || 'bank_transfer_option';
      
      // Properly format client details to avoid JSON parsing issues
      const clientDetails = orderData?.clientDetails ? 
        (typeof orderData.clientDetails === 'string' ? 
          orderData.clientDetails : JSON.stringify(orderData.clientDetails)) : 
        null;
      
      // Format items to ensure they're a valid JSON array and not a string
      const formattedItems = items.map(item => ({
        name: item.title || item.name || "Produto",
        quantity: item.quantity,
        price: item.price,
        type: item.type || 'product',
        domain: item.domain || null
      }));
      
      // Create order in database (or mock in dev)
      let order;
      if (import.meta.env.DEV || window.location.hostname.includes('lovable.app')) {
        // In development, create a mock order
        order = {
          id: "order" + Date.now(),
          order_number: orderNumber,
          user_id: user.id,
          status: orderData?.skipPayment ? 'processing' : 'pending',
          items: formattedItems,
          total_amount: totalAmount,
          payment_status: orderData?.skipPayment ? 'pending_invoice' : 'pending',
          payment_method: paymentMethodValue,
          client_details: clientDetails,
          created_at: new Date().toISOString(),
        };
        
        // Simulate invoice creation
        const invoice = {
          id: "invoice" + Date.now(),
          invoice_number: "INV-" + Date.now().toString().slice(-8),
          user_id: user.id,
          amount: totalAmount,
          status: 'pending',
          items: formattedItems,
          order_id: order.id,
          due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString()
        };
        
        // Store in localStorage to simulate persistence
        const savedOrders = JSON.parse(localStorage.getItem('mock_orders') || '[]');
        const savedInvoices = JSON.parse(localStorage.getItem('mock_invoices') || '[]');
        savedOrders.push(order);
        savedInvoices.push(invoice);
        localStorage.setItem('mock_orders', JSON.stringify(savedOrders));
        localStorage.setItem('mock_invoices', JSON.stringify(savedInvoices));
        
        // Delay to simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
      } else {
        // In production, create real order
        const { data, error } = await supabase
          .from('orders')
          .insert({
            order_number: orderNumber,
            user_id: user.id,
            status: orderData?.skipPayment ? 'processing' : 'pending',
            items: formattedItems,
            total_amount: totalAmount,
            payment_status: orderData?.skipPayment ? 'pending_invoice' : 'pending',
            payment_method: paymentMethodValue,
            client_details: clientDetails
          })
          .select()
          .single();

        if (error) {
          throw error;
        }
        
        order = data;
      }

      // Clear cart after successful order creation
      clearCart();
      
      toast.success('Pedido salvo com sucesso');
      return order;
    } catch (error: any) {
      toast.error('Erro ao salvar o pedido: ' + error.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveCartAsOrder, isSaving };
};
