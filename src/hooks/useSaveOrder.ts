
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '@/types/cart';

export const useSaveOrder = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { items, total, clearCart } = useCart();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  const saveCartAsOrder = async (options: {
    paymentMethodId: string | null;
    clientDetails: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    skipPayment?: boolean;
  }) => {
    if (!user) {
      toast.error('Para finalizar o pedido, faça login');
      return null;
    }

    try {
      setIsSaving(true);
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create order in database 
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          total_amount: total,
          items: JSON.stringify(items), // Convert items to JSON string
          status: 'pending',
          payment_method: options.paymentMethodId,
          payment_status: options.skipPayment ? 'pending_invoice' : 'pending',
          client_details: options.clientDetails
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Process items based on their type
      for (const item of items) {
        // Determine item type
        const itemType = determineItemType(item);
        
        if (itemType === 'domain') {
          // Create domain record
          await processDomain(item, user.id);
        } else if (itemType === 'service') {
          // Create service record
          await processService(item, user.id);
        }
      }

      // Success - clear cart
      toast.success('Pedido realizado com sucesso!');
      
      return orderData;
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast.error(`Erro ao salvar pedido: ${error.message}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to determine item type
  const determineItemType = (item: CartItem): 'domain' | 'service' | 'other' => {
    const name = (item.name || '').toLowerCase();
    
    if (name.includes('domínio') || name.includes('dominio') || 
        name.includes('domain') || item.type === 'domain') {
      return 'domain';
    }
    
    if (name.includes('hostin') || name.includes('vps') || 
        name.includes('servidor') || name.includes('server') || 
        name.includes('wordpress') || name.includes('email') || 
        name.includes('cpanel') || item.type === 'service' || 
        item.service_type) {
      return 'service';
    }
    
    return 'other';
  };

  // Process domain items
  const processDomain = async (item: CartItem, userId: string) => {
    const domain = item.domain || item.name.split(' ')[0]; // Extract domain name
    const registrationDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Default 1 year registration
    
    await supabase.from('client_domains').insert({
      domain_name: domain,
      user_id: userId,
      status: 'pending',
      registration_date: registrationDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      auto_renew: true,
      whois_privacy: false,
      is_locked: true
    });
  };

  // Process service items
  const processService = async (item: CartItem, userId: string) => {
    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Default 1 year subscription
    
    // Determine service type
    let serviceType = 'hosting';
    const name = (item.name || '').toLowerCase();
    
    if (name.includes('email')) {
      serviceType = 'email';
    } else if (name.includes('vps')) {
      serviceType = 'vps';
    } else if (name.includes('dedica')) {
      serviceType = 'dedicated';
    } else if (name.includes('wordpress')) {
      serviceType = 'wordpress';
    }
    
    await supabase.from('client_services').insert({
      name: item.name,
      service_type: serviceType,
      status: 'pending',
      renewal_date: renewalDate.toISOString(),
      price_monthly: item.price / 12, // Estimate monthly price
      price_yearly: item.price,
      description: item.description || '',
      user_id: userId
    });
  };

  return { saveCartAsOrder, isSaving };
};
