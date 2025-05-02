
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '@/types/cart';

export const useOrderSubmission = (formData: any, paymentMethod: string | null) => {
  const [isSaving, setIsSaving] = useState(false);
  const { items, total, clearCart } = useCart();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!user || !paymentMethod) {
      toast.error('Para finalizar o pedido, faça login e selecione um método de pagamento');
      return;
    }

    try {
      setIsSaving(true);
      
      // Format client details
      const clientDetails = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          total_amount: total,
          items: items,
          status: 'pending',
          payment_method: paymentMethod,
          payment_status: 'pending',
          client_details: clientDetails
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

      // Success - clear cart and redirect
      toast.success('Pedido realizado com sucesso!');
      clearCart();
      navigate(`/client/orders`);
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast.error(`Erro ao salvar pedido: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper function to determine item type
  const determineItemType = (item: CartItem): 'domain' | 'service' | 'other' => {
    const name = item.name.toLowerCase();
    
    if (name.includes('domínio') || name.includes('dominio') || 
        name.includes('domain') || item.type === 'domain') {
      return 'domain';
    }
    
    if (name.includes('hostin') || name.includes('vps') || 
        name.includes('servidor') || name.includes('server') || 
        name.includes('wordpress') || name.includes('email') || 
        name.includes('cpanel') || item.type === 'service') {
      return 'service';
    }
    
    return 'other';
  };

  // Process domain items
  const processDomain = async (item: CartItem, userId: string) => {
    const domain = item.name.split(' ')[0]; // Extract domain name
    const registrationDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Default 1 year registration
    
    await supabase.from('domains').insert({
      domain_name: domain,
      user_id: userId,
      status: 'pending',
      registration_date: registrationDate.toISOString(),
      expiry_date: expiryDate.toISOString(),
      auto_renew: true,
      whois_privacy: false,
      is_locked: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  // Process service items
  const processService = async (item: CartItem, userId: string) => {
    const renewalDate = new Date();
    renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Default 1 year subscription
    
    // Determine service type
    let serviceType = 'hosting';
    const name = item.name.toLowerCase();
    
    if (name.includes('email')) {
      serviceType = 'email';
    } else if (name.includes('vps')) {
      serviceType = 'vps';
    } else if (name.includes('dedica')) {
      serviceType = 'dedicated';
    } else if (name.includes('wordpress')) {
      serviceType = 'wordpress';
    }
    
    await supabase.from('services').insert({
      name: item.name,
      service_type: serviceType,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      renewal_date: renewalDate.toISOString(),
      price_monthly: item.price / 12, // Estimate monthly price
      price_yearly: item.price,
      description: item.description || '',
      user_id: userId
    });
  };

  return { handleSubmit, isSaving };
};
