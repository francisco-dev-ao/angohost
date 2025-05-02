
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/formatters";
import { CartItem } from "@/types/cart";

interface OrderConfirmationProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  paymentMethod: string | null;
  paymentMethods: any[];
  items: CartItem[];
  total: number;
  prevStep: () => void;
}

const OrderConfirmation = ({
  formData,
  paymentMethod,
  paymentMethods,
  items,
  total,
  prevStep,
}: OrderConfirmationProps) => {
  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === paymentMethod
  );

  return (
    <>
      <CardTitle className="mb-4">Confirmação do Pedido</CardTitle>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Dados do Cliente</h3>
          <div className="bg-muted p-4 rounded-lg">
            <p><strong>Nome:</strong> {formData.name}</p>
            <p><strong>E-mail:</strong> {formData.email}</p>
            <p><strong>Telefone:</strong> {formData.phone}</p>
            <p><strong>Endereço:</strong> {formData.address}</p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Método de Pagamento</h3>
          <div className="bg-muted p-4 rounded-lg">
            {selectedPaymentMethod ? (
              <p>{selectedPaymentMethod.name} - {selectedPaymentMethod.description}</p>
            ) : (
              <p>Nenhum método de pagamento selecionado</p>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Itens do Pedido</h3>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <p>{item.title || item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantidade: {item.quantity}
                  </p>
                </div>
                <p>{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between font-bold">
              <p>Total:</p>
              <p>{formatPrice(total)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-start">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
