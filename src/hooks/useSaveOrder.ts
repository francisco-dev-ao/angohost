
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { v4 as uuidv4 } from 'uuid';
import { CartItem } from '@/contexts/CartContext';
import { parsePrice } from '@/utils/formatters';

interface SaveOrderProps {
  paymentMethodId: string;
  clientDetails: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

// Map to valid service types for client services table
const mapToValidServiceType = (type: string) => {
  const validTypes: Array<"email" | "cpanel_hosting" | "wordpress_hosting" | "vps" | "dedicated_server" | "exchange"> = 
    ["email", "cpanel_hosting", "wordpress_hosting", "vps", "dedicated_server", "exchange"];
  
  const match = validTypes.find(validType => type.includes(validType));
  return match || "cpanel_hosting";
};

export const useSaveOrder = () => {
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const saveCartAsOrder = async (options: SaveOrderProps) => {
    if (!user) {
      throw new Error('Você precisa estar logado para concluir o pedido');
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          payment_method: options.paymentMethodId,
          client_details: options.clientDetails,
          items: JSON.stringify(items), // Convert items array to JSON string
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Process services from cart items
      for (const item of items) {
        if (item.type === 'hosting' || item.type === 'email') {
          await createService(item, user.id);
        } else if (item.type === 'domain') {
          await createDomain(item, user.id);
        }
      }
      
      return order;
    } catch (err: any) {
      console.error('Error saving order:', err);
      setError(err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };
  
  const createService = async (item: CartItem, userId: string) => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + (item.years || 1));
    
    const serviceType = mapToValidServiceType(item.title.toLowerCase());
      
    const { error } = await supabase
      .from('client_services')
      .insert({
        user_id: userId,
        service_type: serviceType,
        name: item.title,
        description: item.domain ? `Domínio: ${item.domain}` : (item.description || ''),
        status: 'pending',
        renewal_date: expiryDate.toISOString(),
        price_monthly: item.basePrice / 12,
        price_yearly: item.basePrice,
        auto_renew: true
      });
      
    if (error) throw error;
  };
  
  const createDomain = async (item: CartItem, userId: string) => {
    if (!item.domain) return; // Skip if no domain in item
    
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + (item.years || 1));
    
    const { error } = await supabase
      .from('client_domains')
      .insert({
        user_id: userId,
        domain_name: item.domain,
        registration_date: new Date().toISOString(),
        expiry_date: expiryDate.toISOString(),
        status: 'pending_registration', // Using a valid status value
        auto_renew: true,
        whois_privacy: false,
        nameservers: [
          "ns1.angohost.ao",
          "ns2.angohost.ao"
        ]
      });
      
    if (error) throw error;
  };
  
  return {
    saveCartAsOrder,
    isSaving,
    error
  };
};
