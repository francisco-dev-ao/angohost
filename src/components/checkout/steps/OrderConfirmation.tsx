
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { formatPrice } from "@/utils/formatters";
import { CartItem } from "@/types/cart";

interface OrderConfirmationProps {
  formData: any;
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
  // Find the selected payment method
  const selectedPayment = paymentMethods.find(method => method.id === paymentMethod);

  return (
    <>
      <CardTitle className="mb-4">Confirmação do Pedido</CardTitle>
      <div className="space-y-6">
        <div>
          <h3 className="text-base font-medium mb-2">Dados do cliente</h3>
          <div className="bg-muted p-3 rounded">
            <p><span className="font-medium">Nome:</span> {formData.name}</p>
            <p><span className="font-medium">Email:</span> {formData.email}</p>
            <p><span className="font-medium">Telefone:</span> {formData.phone}</p>
            <p><span className="font-medium">Endereço:</span> {formData.address}</p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium mb-2">Método de pagamento</h3>
          <div className="bg-muted p-3 rounded">
            <p>{selectedPayment?.name || 'Método de pagamento não selecionado'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium mb-2">Itens do pedido</h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between p-2 bg-muted rounded">
                <div>
                  <span className="font-medium">{item.name}</span>
                  {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                </div>
                <div className="text-right">
                  <p>{formatPrice(item.price)}</p>
                  <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="flex justify-between font-bold p-2">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={prevStep} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
