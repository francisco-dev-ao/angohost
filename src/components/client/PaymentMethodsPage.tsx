
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import PaymentMethodCard from "./payment-methods/PaymentMethodCard";
import AddPaymentMethodDialog from "./payment-methods/AddPaymentMethodDialog";
import EmptyPaymentMethods from "./payment-methods/EmptyPaymentMethods";

const PaymentMethodsPage = () => {
  const { paymentMethods, loading, handleSetDefault, handleRemove, addPaymentMethod } = usePaymentMethods();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    billingAddress: "",
  });

  const handleNewPaymentMethodChange = (field: string, value: string) => {
    setNewPaymentMethod({...newPaymentMethod, [field]: value});
  };

  const handleSubmitNewPaymentMethod = async () => {
    await addPaymentMethod(newPaymentMethod);
    setNewPaymentMethod({
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvv: "",
      billingAddress: "",
    });
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Métodos de Pagamento</h1>
        <Button className="flex items-center gap-2" onClick={() => setDialogOpen(true)}>
          <Plus size={16} />
          <span>Adicionar Novo</span>
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Carregando métodos de pagamento...</div>
      ) : paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={handleSetDefault}
              onRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <EmptyPaymentMethods onAddNew={() => setDialogOpen(true)} />
      )}
      
      <AddPaymentMethodDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        newPaymentMethod={newPaymentMethod}
        onNewPaymentMethodChange={handleNewPaymentMethodChange}
        onSubmit={handleSubmitNewPaymentMethod}
      />
    </div>
  );
};

export default PaymentMethodsPage;
