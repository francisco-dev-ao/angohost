
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCheckout = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items, removeFromCart, updateItemPrice } = useCart();
  
  const [activeStep, setActiveStep] = useState('client');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    client: false,
    service: false,
    payment: false
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
  });
  
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [billingCycle, setBillingCycle] = useState('annual');
  
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    calculateTotals();
    
    if (user) {
      loadUserProfile();
      loadPaymentMethods();
    }
    
    setIsLoading(false);
  }, [user, items]);
  
  useEffect(() => {
    // Verificar se os dados do cliente estão preenchidos
    if (user && formData.name && formData.email && formData.phone && formData.address) {
      setCompletedSteps(prev => ({ ...prev, client: true }));
    } else {
      setCompletedSteps(prev => ({ ...prev, client: false }));
    }
  }, [user, formData]);
  
  const calculateTotals = () => {
    const cartSubtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // Removed the tax calculation
    const cartTotal = cartSubtotal - discount;
    
    setSubtotal(cartSubtotal);
    setTotal(cartTotal);
  };
  
  const loadUserProfile = async () => {
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
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  
  const loadPaymentMethods = async () => {
    if (!user) return;
    
    try {
      let defaultMethods = [
        { 
          id: 'bank_transfer', 
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
      
      if (allMethods.length > 0) {
        setPaymentMethod(allMethods[0].id);
        setCompletedSteps(prev => ({ ...prev, payment: true }));
      }
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      toast.error('Erro ao carregar métodos de pagamento');
      
      const bankTransfer = { 
        id: 'bank_transfer', 
        name: 'Transferência Bancária', 
        is_active: true,
        payment_type: 'bank_transfer',
        description: 'Pague por transferência bancária e envie o comprovante'
      };
      setPaymentMethods([bankTransfer]);
      setPaymentMethod('bank_transfer');
    }
  };
  
  const handlePaymentMethodChange = (methodId: string) => {
    setPaymentMethod(methodId);
    setCompletedSteps(prev => ({ ...prev, payment: true }));
  };
  
  const handleBillingCycleChange = (cycle: string) => {
    setBillingCycle(cycle);
    
    // Recalcular preços com base no ciclo de cobrança
    items.forEach(item => {
      if (item.type === 'service' || item.type === 'hosting') {
        const basePrice = item.basePrice;
        let newPrice = basePrice;
        
        if (cycle === 'monthly') {
          // Preço mensal (sem desconto)
          newPrice = basePrice;
        } else {
          // Preço anual (com desconto de 15%)
          newPrice = basePrice * 0.85 * 12;
        }
        
        updateItemPrice(item.id, newPrice);
      }
    });
    
    // Recalcular totais após atualização dos preços
    setTimeout(() => calculateTotals(), 0);
  };
  
  const handleUpdateBillingCycle = (itemId: string, years: number) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;
    
    let newPrice = item.basePrice;
    
    // Aplicar desconto com base no número de anos
    if (years === 2) {
      newPrice = newPrice * 0.95 * years; // 5% de desconto para 2 anos
    } else if (years === 3) {
      newPrice = newPrice * 0.90 * years; // 10% de desconto para 3 anos
    } else {
      newPrice = newPrice * years;
    }
    
    // Atualizar o item com o novo preço e período
    const updatedItem = {
      ...item,
      price: newPrice,
      years: years
    };
    
    // Remover o item antigo e adicionar o atualizado (simulando uma atualização)
    updateItemPrice(itemId, newPrice);
    
    // Recalcular totais após atualização
    setTimeout(() => calculateTotals(), 0);
    
    toast.success(`Período de contratação alterado para ${years} ${years === 1 ? 'ano' : 'anos'}`);
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removido do pedido');
    
    // Recalcular totais após remoção
    setTimeout(() => calculateTotals(), 0);
  };
  
  const nextStep = () => {
    if (activeStep === 'client') setActiveStep('service');
    else if (activeStep === 'service') setActiveStep('payment');
  };
  
  const prevStep = () => {
    if (activeStep === 'payment') setActiveStep('service');
    else if (activeStep === 'service') setActiveStep('client');
  };

  return {
    activeStep,
    setActiveStep,
    completedSteps,
    paymentMethod,
    paymentMethods,
    formData,
    setFormData,
    subtotal,
    discount,
    total,
    billingCycle,
    isLoading,
    items,
    handlePaymentMethodChange,
    handleBillingCycleChange,
    handleUpdateBillingCycle,
    handleRemoveItem,
    nextStep,
    prevStep,
    setCompletedSteps,
  };
};
