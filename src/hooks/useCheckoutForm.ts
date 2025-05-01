
import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

export const useCheckoutForm = () => {
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [selectedContactProfile, setSelectedContactProfile] = useState<string | null>(null);
  const [skipPayment, setSkipPayment] = useState(false);
  
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
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, phone, address')
        .eq('id', user.id)
        .single();
        
      if (!error && data) {
        setFormData({
          name: data.full_name || user.user_metadata?.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          address: data.address || '',
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
        }
      ];
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true);
        
      if (error) throw error;
      
      const allMethods = [...defaultMethods, ...(data || [])];
      setPaymentMethods(allMethods);
      
      const defaultMethod = allMethods.find(m => m.payment_type === 'bank_transfer');
      if (defaultMethod) {
        setSelectedPaymentMethod(defaultMethod.id);
      } else if (allMethods.length > 0) {
        setSelectedPaymentMethod(allMethods[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erro ao carregar métodos de pagamento');
      
      const bankTransfer = { 
        id: 'bank_transfer_option', 
        name: 'Transferência Bancária', 
        is_active: true,
        payment_type: 'bank_transfer',
        description: 'Pague por transferência bancária e envie o comprovante'
      };
      setPaymentMethods([bankTransfer]);
      setSelectedPaymentMethod('bank_transfer_option');
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
    selectedContactProfile,
    setSelectedContactProfile,
    skipPayment,
    setSkipPayment,
    hasDomains
  };
};
