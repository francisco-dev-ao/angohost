
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
      
      // Limpar e formatar o valor total
      const totalAmount = parseFloat(total.toString());
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Create order in database 
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: user.id,
          total_amount: totalAmount,
          items: items, // Já está no formato correto para JSONB
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
        // Ensure item has a name (use title if name is not available)
        const itemWithName = {
          ...item,
          name: item.name || item.title || 'Item sem nome'
        };
        
        // Determine item type
        const itemType = determineItemType(itemWithName);
        
        if (itemType === 'domain') {
          // Create domain record
          await processDomain(itemWithName, user.id);
        } else if (itemType === 'service') {
          // Create service record
          await processService(itemWithName, user.id);
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
    // Use name or title, whichever is available
    const itemName = (item.name || item.title || '').toLowerCase();
    
    if (itemName.includes('domínio') || itemName.includes('dominio') || 
        itemName.includes('domain') || item.type === 'domain' ||
        (item.domain && item.domain.length > 0)) {
      return 'domain';
    }
    
    if (itemName.includes('hostin') || itemName.includes('vps') || 
        itemName.includes('servidor') || itemName.includes('server') || 
        itemName.includes('wordpress') || itemName.includes('email') || 
        itemName.includes('cpanel') || item.type === 'service' || 
        item.service_type) {
      return 'service';
    }
    
    return 'other';
  };

  // Process domain items
  const processDomain = async (item: CartItem, userId: string) => {
    try {
      const domainName = item.domain || (item.name ? item.name.split(' ')[0] : item.title?.split(' ')[0]); 
      if (!domainName) {
        console.error('No domain name found for item:', item);
        return;
      }

      const registrationDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Default 1 year registration
      
      await supabase.from('client_domains').insert({
        domain_name: domainName,
        user_id: userId,
        status: 'pending_registration', // Using valid enum value
        registration_date: registrationDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
        auto_renew: true,
        whois_privacy: false,
        is_locked: true
      });
    } catch (error) {
      console.error('Error processing domain:', error);
    }
  };

  // Process service items
  const processService = async (item: CartItem, userId: string) => {
    try {
      const renewalDate = new Date();
      renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Default 1 year subscription
      
      // Map service type to known service types
      const serviceType = mapToValidServiceType(item);
      const serviceDescription = item.description || '';
      
      // Preparar payload do serviço
      const serviceData = {
        user_id: userId,
        service_type: serviceType,
        description: serviceDescription,
        status: 'pending',
        renewal_date: renewalDate.toISOString(),
        price_monthly: item.price / 12, // Estimate monthly price
        price_yearly: item.price,
        name: item.name || item.title || 'Serviço'
      };
      
      await supabase.from('client_services').insert(serviceData);
    } catch (error) {
      console.error('Error processing service:', error);
    }
  };

  // Map service type to valid enum values
  const mapToValidServiceType = (item: CartItem): 'email' | 'cpanel_hosting' | 'wordpress_hosting' | 'vps' | 'dedicated_server' | 'exchange' | 'other' => {
    const name = (item.name || item.title || '').toLowerCase();
    
    if (name.includes('email')) {
      return 'email';
    } else if (name.includes('vps')) {
      return 'vps';
    } else if (name.includes('dedica')) {
      return 'dedicated_server';
    } else if (name.includes('wordpress')) {
      return 'wordpress_hosting';
    } else if (name.includes('cpanel')) {
      return 'cpanel_hosting';
    } else if (name.includes('exchange')) {
      return 'exchange';
    } else {
      return 'other';
    }
  };

  return { saveCartAsOrder, isSaving };
};
