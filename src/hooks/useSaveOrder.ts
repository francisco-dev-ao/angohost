
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
      
      // Prepare payment method - handle default bank transfer option specifically
      let paymentMethodValue = null;
      
      if (orderData?.paymentMethodId) {
        // If it's our default bank transfer option (which is not a UUID)
        if (orderData.paymentMethodId === 'bank_transfer_option') {
          paymentMethodValue = 'bank_transfer_option';
        } else {
          // Otherwise use the UUID as normal
          paymentMethodValue = orderData.paymentMethodId;
        }
      }
      
      // Properly format client details to avoid JSON parsing issues
      const clientDetails = orderData?.clientDetails ? 
        JSON.stringify(orderData.clientDetails) : 
        null;
      
      // Format items to ensure they're a valid JSON array and not a string
      const formattedItems = items.map(item => ({
        name: item.title,
        quantity: item.quantity,
        price: item.price,
        type: item.type || 'product',
        domain: item.domain || null
      }));
      
      const { data: order, error } = await supabase
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
