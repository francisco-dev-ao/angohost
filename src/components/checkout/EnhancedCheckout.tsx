
import React from 'react';
import { useCheckoutProcess } from '@/hooks/useCheckoutProcess';
import CheckoutAuth from './auth/CheckoutAuth';
import CheckoutSuccess from './success/CheckoutSuccess';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';

const EnhancedCheckout = () => {
  const {
    items,
    subtotal,
    discount,
    total,
    loading,
    orderPlaced,
    authVisible,
    selectedBillingPeriod,
    handleBillingPeriodChange,
    handleAuthComplete,
    handleSubmitOrder
  } = useCheckoutProcess();

  if (orderPlaced) {
    return <CheckoutSuccess />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
            items={items} 
            subtotal={subtotal} 
            discount={discount} 
            total={total} 
            billingCycle={selectedBillingPeriod}
            handleBillingCycleChange={handleBillingPeriodChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;
