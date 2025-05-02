
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatters";
import { CartItem } from "@/contexts/CartContext";

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
  prevStep 
}: OrderConfirmationProps) => {
  
  // Find the selected payment method from the list
  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Confirmação do Pedido</h2>
      
      <div className="space-y-4">
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Detalhes do Cliente</h3>
          <div className="grid gap-1">
            <p><span className="text-muted-foreground">Nome:</span> {formData.name}</p>
            <p><span className="text-muted-foreground">Email:</span> {formData.email}</p>
            <p><span className="text-muted-foreground">Telefone:</span> {formData.phone}</p>
            <p><span className="text-muted-foreground">Endereço:</span> {formData.address}</p>
          </div>
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Método de Pagamento</h3>
          {selectedPaymentMethod ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedPaymentMethod.payment_type}</Badge>
              <span>{selectedPaymentMethod.name}</span>
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum método de pagamento selecionado</p>
          )}
        </div>
        
        <div className="border rounded-md p-4">
          <h3 className="font-medium mb-2">Itens do Pedido</h3>
          <ul className="divide-y">
            {items.map((item, index) => (
              <li key={index} className="py-2">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.domain && <p className="text-sm text-muted-foreground">Domínio: {item.domain}</p>}
                  </div>
                  <p>{formatPrice(item.price)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          Voltar
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
