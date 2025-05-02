
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, FileText } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  payment_type: string;
  description?: string;
}

interface PaymentOptionsSectionProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (methodId: string) => void;
  loading: boolean;
  skipPayment: boolean;
  setSkipPayment: (skip: boolean) => void;
  isSaving: boolean;
}

const PaymentOptionsSection = ({ 
  paymentMethods, 
  selectedPaymentMethod, 
  setSelectedPaymentMethod,
  loading,
  skipPayment,
  setSkipPayment,
  isSaving
}: PaymentOptionsSectionProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Opções de Pagamento</CardTitle>
        <CardDescription>Selecione como deseja prosseguir com o pagamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-6 border p-4 rounded-md bg-primary/5 border-primary/20">
          <Switch 
            id="skip-payment" 
            checked={skipPayment}
            onCheckedChange={setSkipPayment}
          />
          <Label htmlFor="skip-payment" className="flex items-center cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            <span>
              <span className="font-medium">Gerar apenas fatura</span> 
              <span className="block text-sm text-muted-foreground">(sem pagamento imediato)</span>
            </span>
          </Label>
        </div>
        
        {!skipPayment && (
          <>
            {loading ? (
              <div className="text-center py-4">Carregando métodos de pagamento...</div>
            ) : paymentMethods.length > 0 ? (
              <RadioGroup 
                value={selectedPaymentMethod || undefined}
                onValueChange={setSelectedPaymentMethod}
              >
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={`flex items-center justify-between border rounded-md p-4 ${
                        selectedPaymentMethod === method.id ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                        <Label htmlFor={`payment-${method.id}`} className="flex items-center space-x-2">
                          {method.payment_type === 'bank_transfer' ? (
                            <Banknote className="h-4 w-4" />
                          ) : (
                            <CreditCard className="h-4 w-4" />
                          )}
                          <span>
                            {method.name || 'Método de Pagamento'} 
                            {method.payment_type === 'bank_transfer' && (
                              <span className="ml-2 text-sm text-muted-foreground">(Padrão)</span>
                            )}
                          </span>
                        </Label>
                      </div>
                      {method.description && (
                        <div className="hidden md:block text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description && (
                    <p className="md:hidden text-sm text-muted-foreground">
                      {paymentMethods.find(m => m.id === selectedPaymentMethod)?.description}
                    </p>
                  )}
                </div>
              </RadioGroup>
            ) : (
              <div className="text-center py-4 space-y-4">
                <p>Nenhum método de pagamento disponível</p>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="ghost" onClick={() => navigate('/cart')}>
          Voltar para o carrinho
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Processando...' : 'Finalizar compra'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentOptionsSection;
