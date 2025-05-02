
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';
import { useSaveOrder } from '@/hooks/useSaveOrder';
import { useContactProfiles } from '@/hooks/useContactProfiles';
import { toast } from 'sonner';
import { useCheckoutForm } from '@/hooks/useCheckoutForm';

// Import smaller components
import ContactProfileSection from './form/ContactProfileSection';
import ClientInfoSection from './form/ClientInfoSection';
import PaymentOptionsSection from './form/PaymentOptionsSection';
import EmptyCartNotice from './form/EmptyCartNotice';

interface CheckoutFormProps {
  onSubmit?: (formData: any) => void;
  onComplete?: (orderId: string) => void;
  loading?: boolean;
}

const CheckoutForm = ({ onSubmit, onComplete, loading: externalLoading }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { items } = useCart();
  const { saveCartAsOrder, isSaving } = useSaveOrder();
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  
  const {
    formData,
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
  } = useCheckoutForm();

  useEffect(() => {
    if (profiles && profiles.length > 0) {
      setSelectedContactProfile(profiles[0].id);
    }
  }, [profiles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If external onSubmit is provided, use it
    if (onSubmit) {
      onSubmit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: selectedPaymentMethod,
        contactProfileId: selectedContactProfile,
        skipPayment: skipPayment
      });
      return;
    }
    
    if (!user) {
      toast.error('Você precisa estar logado para finalizar a compra');
      navigate('/register');
      return;
    }
    
    if (!skipPayment && !selectedPaymentMethod) {
      toast.error('Selecione um método de pagamento');
      return;
    }
    
    if (hasDomains() && !selectedContactProfile) {
      toast.error('Selecione um perfil de contato para titularidade dos domínios');
      return;
    }
    
    try {
      const orderData = {
        paymentMethodId: skipPayment ? null : selectedPaymentMethod,
        contactProfileId: selectedContactProfile,
        skipPayment: skipPayment,
        clientDetails: selectedContactProfile 
          ? profiles.find(p => p.id === selectedContactProfile) 
          : { name: formData.name, email: formData.email, phone: formData.phone, address: formData.address }
      };
      
      const order = await saveCartAsOrder(orderData);
      if (order) {
        onComplete?.(order.id);
        
        if (skipPayment) {
          toast.success('Pedido criado com sucesso! Uma fatura foi gerada na sua área de cliente.');
        } else {
          toast.success('Pedido criado com sucesso! Aguardando pagamento.');
        }
        navigate(`/client/orders?order=${order.id}`);
      }
    } catch (error: any) {
      toast.error('Erro ao processar o pedido: ' + error.message);
    }
  };

  if (items.length === 0) {
    return <EmptyCartNotice />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <ContactProfileSection 
          profiles={profiles}
          isLoadingProfiles={isLoadingProfiles}
          selectedContactProfile={selectedContactProfile}
          setSelectedContactProfile={setSelectedContactProfile}
          hasDomains={hasDomains()}
        />

        <ClientInfoSection 
          formData={formData}
          profileLoaded={profileLoaded}
        />

        <PaymentOptionsSection 
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          loading={loading}
          skipPayment={skipPayment}
          setSkipPayment={setSkipPayment}
          isSaving={isSaving || !!externalLoading}
        />
      </div>
    </form>
  );
};

export default CheckoutForm;
