
import React from 'react';

const PaymentMethodsDisplay = () => {
  return (
    <div className="container mt-12 text-center">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-xl font-medium mb-4">Métodos de Pagamento Aceitos</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
          </div>
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsDisplay;
