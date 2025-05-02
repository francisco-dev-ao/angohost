
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Building, QrCode, Check, Info } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CardTitle } from "@/components/ui/card";
import { executeQuery } from "@/utils/database";

interface PaymentStepProps {
  nextStep: () => void;
  formData: Record<string, any>;
  paymentMethod: string | null;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string | null>>;
  completedSteps: Record<string, boolean>;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  payment_type: 'credit_card' | 'bank_transfer' | 'pix' | 'other';
  is_active: boolean;
}

const PaymentStep = ({
  nextStep,
  formData,
  paymentMethod,
  setPaymentMethod,
  handleSubmit,
  isSubmitting,
  completedSteps
}: PaymentStepProps) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If we're unable to fetch from the database, use default payment methods
        if (!completedSteps.client) {
          setPaymentMethods([
            {
              id: 'bank_transfer_option',
              name: 'Transferência Bancária',
              description: 'Pague por transferência bancária e envie o comprovante',
              payment_type: 'bank_transfer',
              is_active: true
            },
            {
              id: 'credit_card_option',
              name: 'Cartão de Crédito',
              description: 'Pague com seu cartão de crédito',
              payment_type: 'credit_card',
              is_active: true
            },
            {
              id: 'pix_option',
              name: 'PIX',
              description: 'Faça um pagamento instantâneo via PIX',
              payment_type: 'pix',
              is_active: true
            }
          ]);
          setLoading(false);
          return;
        }
        
        const result = await executeQuery(
          `SELECT * FROM payment_methods WHERE is_active = $1`,
          [true]
        );
        
        if (result.success && result.data && result.data.length > 0) {
          setPaymentMethods(result.data as PaymentMethod[]);
        } else {
          // If no payment methods are available in the database, use default methods
          setPaymentMethods([
            {
              id: 'bank_transfer_option',
              name: 'Transferência Bancária',
              description: 'Pague por transferência bancária e envie o comprovante',
              payment_type: 'bank_transfer',
              is_active: true
            },
            {
              id: 'credit_card_option',
              name: 'Cartão de Crédito',
              description: 'Pague com seu cartão de crédito',
              payment_type: 'credit_card',
              is_active: true
            },
            {
              id: 'pix_option',
              name: 'PIX',
              description: 'Faça um pagamento instantâneo via PIX',
              payment_type: 'pix',
              is_active: true
            }
          ]);
        }
      } catch (err: any) {
        console.error('Error fetching payment methods:', err);
        setError(err.message);
        
        // Use default methods if there's an error
        setPaymentMethods([
          {
            id: 'bank_transfer_option',
            name: 'Transferência Bancária',
            description: 'Pague por transferência bancária e envie o comprovante',
            payment_type: 'bank_transfer',
            is_active: true
          },
          {
            id: 'credit_card_option',
            name: 'Cartão de Crédito',
            description: 'Pague com seu cartão de crédito',
            payment_type: 'credit_card',
            is_active: true
          },
          {
            id: 'pix_option',
            name: 'PIX',
            description: 'Faça um pagamento instantâneo via PIX',
            payment_type: 'pix',
            is_active: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPaymentMethods();
  }, [completedSteps.client]);
  
  const getPaymentIcon = (type: string) => {
    switch(type) {
      case 'credit_card':
        return <CreditCard className="h-5 w-5 text-primary" />;
      case 'bank_transfer':
        return <Building className="h-5 w-5 text-primary" />;
      case 'pix':
        return <QrCode className="h-5 w-5 text-primary" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };
  
  // If no payment method is selected yet, default to the first available one
  useEffect(() => {
    if (!paymentMethod && paymentMethods.length > 0) {
      setPaymentMethod(paymentMethods[0].id);
    }
  }, [paymentMethods, paymentMethod, setPaymentMethod]);
  
  return (
    <>
      <CardTitle className="mb-4">Método de Pagamento</CardTitle>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        paymentMethods.length > 0 ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <RadioGroup 
                value={paymentMethod || ''}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 gap-4"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-input hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                    <div className="flex-shrink-0">
                      {getPaymentIcon(method.payment_type)}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="text-base font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
              </RadioGroup>

              {/* Payment method specific details */}
              {paymentMethod === 'bank_transfer_option' && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Dados para transferência:</h3>
                  <p className="text-sm">Banco: Banco Angolano de Investimentos (BAI)</p>
                  <p className="text-sm">Titular: AngoHost Serviços de Tecnologia</p>
                  <p className="text-sm">Conta: 123456789-00</p>
                  <p className="text-sm">IBAN: AO06005500000123456789100</p>
                  <p className="text-sm mt-2">Após realizar a transferência, envie o comprovante para o e-mail: pagamentos@angohost.ao</p>
                </div>
              )}
              
              {paymentMethod === 'pix_option' && (
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Pagamento via PIX:</h3>
                  <p className="text-sm">Use o QR Code abaixo ou a chave PIX para pagamento.</p>
                  <p className="text-sm">Chave PIX: pagamentos@angohost.ao</p>
                  <div className="flex justify-center my-4">
                    <div className="bg-white p-4 rounded">
                      {/* Placeholder for QR code image */}
                      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                        <QrCode className="h-16 w-16 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button type="submit" disabled={!paymentMethod || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      Finalizar Pedido
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Nenhum método de pagamento disponível</h3>
            <p className="text-muted-foreground mb-4">
              Não foi possível carregar os métodos de pagamento. Por favor, tente novamente mais tarde.
            </p>
          </div>
        )
      )}
    </>
  );
};

export default PaymentStep;
