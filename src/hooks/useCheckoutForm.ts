
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { executeQuery } from '@/utils/database';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export const useCheckoutForm = () => {
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [skipPayment, setSkipPayment] = useState(true); // Default to true (skip payment)
  
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchPaymentMethods();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    try {
      const { success, data, error } = await executeQuery(
        'SELECT full_name, email, phone, address FROM profiles WHERE id = $1 LIMIT 1',
        [user.id]
      );
      
      if (success && data && data.length > 0) {
        const profile = data[0];
        setFormData({
          name: profile.full_name || user.user_metadata?.full_name || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
        });
      } else {
        setFormData({
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: '',
          address: '',
        });
      }
      setProfileLoaded(true);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchPaymentMethods = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      let defaultMethods = [
        { 
          id: 'bank_transfer_option', 
          name: 'Transferência Bancária', 
          is_active: true,
          payment_type: 'bank_transfer',
          description: 'Pague por transferência bancária e envie o comprovante'
        },
        { 
          id: 'credit_card_option', 
          name: 'Cartão de Crédito', 
          is_active: true,
          payment_type: 'credit_card',
          description: 'Pague com seu cartão de crédito'
        },
        { 
          id: 'pix_option', 
          name: 'PIX', 
          is_active: true,
          payment_type: 'pix',
          description: 'Faça um pagamento instantâneo via PIX'
        }
      ];
      
      const { success, data, error } = await executeQuery(
        'SELECT * FROM payment_methods WHERE is_active = $1',
        [true]
      );
      
      if (!success || error) throw new Error(error || 'Erro ao buscar métodos de pagamento');
      
      const allMethods = [...defaultMethods, ...(data || [])];
      setPaymentMethods(allMethods);
      
      // Default payment method (though we're defaulting to skipPayment now)
      if (allMethods.length > 0) {
        setSelectedPaymentMethod(allMethods[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erro ao carregar métodos de pagamento');
      
      const defaultMethods = [
        { 
          id: 'bank_transfer_option', 
          name: 'Transferência Bancária', 
          is_active: true,
          payment_type: 'bank_transfer',
          description: 'Pague por transferência bancária e envie o comprovante'
        },
        { 
          id: 'pix_option', 
          name: 'PIX', 
          is_active: true,
          payment_type: 'pix',
          description: 'Faça um pagamento instantâneo via PIX'
        }
      ];
      setPaymentMethods(defaultMethods);
      setSelectedPaymentMethod(defaultMethods[0].id);
    } finally {
      setLoading(false);
    }
  };

  const hasDomains = () => {
    return items.some(item => item.type === 'domain');
  };

  return {
    formData,
    setFormData,
    profileLoaded,
    paymentMethods,
    loading,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    skipPayment,
    setSkipPayment,
    hasDomains
  };
};
