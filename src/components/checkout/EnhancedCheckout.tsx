
import React from 'react';
import { useCheckoutProcess } from '@/hooks/useCheckoutProcess';
import CheckoutAuth from './auth/CheckoutAuth';
import CheckoutSuccess from './success/CheckoutSuccess';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { useCart } from '@/contexts/CartContext';

const EnhancedCheckout = () => {
  const navigate = useNavigate();
  const { items, total } = useCart();
  
  const {
    loading,
    orderPlaced,
    authVisible,
    handleAuthComplete,
    handleSubmitOrder
  } = useCheckoutProcess();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subtotal - total;

  if (orderPlaced) {
    return <CheckoutSuccess />;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-lg shadow-sm">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
        <p className="text-muted-foreground mb-8">Não há itens no seu carrinho para finalizar a compra.</p>
        <div className="space-y-4">
          <Button onClick={() => navigate('/domains')} className="px-8 bg-[#673de6] hover:bg-[#5025d1]">
            Pesquisar domínios
          </Button>
          <div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="px-8"
            >
              Continuar explorando
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {items.length > 0 && (
        <div className="mb-6">
          <CountdownTimer 
            initialMinutes={15} 
            message="Oferta por tempo limitado!" 
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {authVisible ? (
            <CheckoutAuth onAuthComplete={handleAuthComplete} />
          ) : (
            <CheckoutForm onSubmit={handleSubmitOrder} loading={loading} />
          )}
        </div>
        <div>
          <OrderSummary 
            currentStep={authVisible ? 1 : 2}
            canProceed={true}
            onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmitOrder({
                name: '',
                email: '',
                phone: '',
                address: '',
                paymentMethod: null,
                skipPayment: false
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;
