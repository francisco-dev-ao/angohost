
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { executeQuery } from '@/utils/database';

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
        title: item.title || "Produto",
        name: item.title || "Produto",
        quantity: item.quantity,
        price: item.price,
        type: item.type || 'product',
        domain: item.domain || null,
        service_type: item.service_type || null
      }));
      
      // Create order in database
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
      
      // Process services and domains directly from the order items
      for (const item of formattedItems) {
        if (item.type === 'domain' && item.domain) {
          // Create domain entry
          const { error: domainError } = await supabase
            .from('client_domains')
            .insert({
              user_id: user.id,
              domain_name: item.domain,
              registration_date: new Date().toISOString(),
              expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              auto_renew: true
            });
            
          if (domainError) {
            console.error('Error creating domain:', domainError);
          }
        } 
        else if (['cpanel-hosting', 'wordpress-hosting', 'vps-hosting', 'dedicated-servers'].includes(item.service_type)) {
          // Create service entry
          const { error: serviceError } = await supabase
            .from('client_services')
            .insert({
              user_id: user.id,
              name: item.title,
              service_type: item.service_type,
              price_monthly: item.price / 12, // Convert to monthly price if yearly
              price_yearly: item.price,
              renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'active',
              auto_renew: true
            });
            
          if (serviceError) {
            console.error('Error creating service:', serviceError);
          }
        }
      }
      
      // Create invoice for the order
      const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
      const { error: invoiceError } = await supabase
        .from('invoices')
        .insert({
          user_id: user.id,
          invoice_number: invoiceNumber,
          amount: totalAmount,
          status: 'pending',
          due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // Due in 15 days
          items: formattedItems,
          order_id: data.id,
          client_details: clientDetails,
          company_details: {
            name: 'AngoHost',
            address: 'Av. Principal, Luanda, Angola',
            phone: '+244 923 456 789',
            email: 'faturacao@angohost.ao'
          }
        });
        
      if (invoiceError) {
        console.error('Error creating invoice:', invoiceError);
      }
      
      // Clear cart after successful order creation
      clearCart();
      
      toast.success('Pedido salvo com sucesso');
      return data;
    } catch (error: any) {
      toast.error('Erro ao salvar o pedido: ' + error.message);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveCartAsOrder, isSaving };
};
