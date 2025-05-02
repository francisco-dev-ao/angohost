
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { PaymentMethod } from "@/types/client";

export const usePaymentMethods = () => {
  const { user } = useSupabaseAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentMethods = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('is_default', { ascending: false });
        
      if (error) throw error;
      
      setPaymentMethods(data as PaymentMethod[] || []);
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erro ao carregar métodos de pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', user.id);
        
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_default: true })
        .eq('id', id);
        
      if (error) throw error;
      
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        is_default: method.id === id
      })));
      
      toast.success('Método de pagamento padrão atualizado');
    } catch (error: any) {
      console.error('Error updating default payment method:', error);
      toast.error('Erro ao definir método de pagamento padrão');
    }
  };

  const handleRemove = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .update({ is_active: false })
        .eq('id', id);
        
      if (error) throw error;
      
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      
      toast.success('Método de pagamento removido');
    } catch (error: any) {
      console.error('Error removing payment method:', error);
      toast.error('Erro ao remover método de pagamento');
    }
  };

  const addPaymentMethod = async (paymentData: {
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvv: string;
    billingAddress: string;
  }) => {
    if (!user) return;
    
    try {
      const lastFour = paymentData.cardNumber.slice(-4);
      const brand = getCardBrand(paymentData.cardNumber);
      
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: user.id,
          payment_type: 'credit_card',
          card_brand: brand,
          card_last_four: lastFour,
          card_expiry: paymentData.cardExpiry,
          billing_name: paymentData.cardName,
          billing_address: paymentData.billingAddress,
          is_default: paymentMethods.length === 0,
          is_active: true,
        });
        
      if (error) throw error;
      
      await fetchPaymentMethods();
      
      toast.success('Método de pagamento adicionado');
    } catch (error: any) {
      console.error('Error adding payment method:', error);
      toast.error('Erro ao adicionar método de pagamento');
    }
  };

  const getCardBrand = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = parseInt(cardNumber.substring(0, 2), 10);
    
    if (firstDigit === '4') return 'Visa';
    if (firstTwoDigits >= 51 && firstTwoDigits <= 55) return 'MasterCard';
    if (firstTwoDigits === 34 || firstTwoDigits === 37) return 'American Express';
    if (firstTwoDigits === 65 || firstTwoDigits === 60) return 'Discover';
    
    return 'Unknown';
  };

  useEffect(() => {
    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  return {
    paymentMethods,
    loading,
    fetchPaymentMethods,
    handleSetDefault,
    handleRemove,
    addPaymentMethod,
    getCardBrand
  };
};
