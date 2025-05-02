
import React from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PaymentStepProps {
  paymentMethod: string | null;
  paymentMethods: any[];
  handlePaymentMethodChange: (methodId: string) => void;
  prevStep: () => void;
  isSaving: boolean;
}

const PaymentStep = ({ 
  paymentMethod,
  paymentMethods,
  handlePaymentMethodChange,
  prevStep,
  isSaving
}: PaymentStepProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Método de Pagamento</h2>
      
      <div className="space-y-4">
        <RadioGroup value={paymentMethod || ""} onValueChange={handlePaymentMethodChange}>
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex flex-col">
                <span className="font-medium">{method.name}</span>
                <span className="text-sm text-muted-foreground">{method.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      
      <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          Voltar
        </Button>
        <Button 
          type="submit"
          disabled={!paymentMethod || isSaving}
          className="flex-1"
        >
          {isSaving ? "Processando..." : "Finalizar Compra"}
        </Button>
      </div>
    </div>
  );
};

export default PaymentStep;
