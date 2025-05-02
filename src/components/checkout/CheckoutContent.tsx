
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/contexts/CartContext";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import CustomerInfoStep from "./steps/CustomerInfoStep";
import PaymentStep from "./steps/PaymentStep";
import OrderConfirmation from "./steps/OrderConfirmation";
import { supabase } from "@/integrations/supabase/client";

const CheckoutContent = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const { items, total } = useCart();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      country: 'Angola',
    }
  });
  
  // Initialize form with user data if available
  useEffect(() => {
    if (user?.user_metadata) {
      if (user.user_metadata.full_name) setValue('name', user.user_metadata.full_name);
      if (user.email) setValue('email', user.email);
      if (user.user_metadata.phone) setValue('phone', user.user_metadata.phone);
      if (user.user_metadata.address) setValue('address', user.user_metadata.address);
    }
  }, [user, setValue]);

  // Fetch available payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        // Fetch from database
        const { data, error } = await supabase
          .from("payment_methods")
          .select("*")
          .eq("is_active", true);

        if (error) throw error;

        if (data && data.length > 0) {
          setPaymentMethods(data);
        } else {
          // Fallback to default payment methods if none in DB
          setPaymentMethods([
            {
              id: "credit_card_option",
              name: "Cartão de Crédito/Débito",
              description: "Pagamento seguro via cartão",
              payment_type: "credit_card",
            },
            {
              id: "bank_transfer_option",
              name: "Transferência Bancária",
              description: "BAI, BFA, BIC, BPC",
              payment_type: "bank_transfer",
            },
            {
              id: "pix_option",
              name: "PIX",
              description: "Pagamento instantâneo",
              payment_type: "pix",
            },
          ]);
        }
      } catch (error: any) {
        console.error("Error fetching payment methods:", error);
        toast.error("Erro ao carregar métodos de pagamento");
      }
    };

    fetchPaymentMethods();
  }, []);

  // Handle form submission based on current step
  const formData = watch();
  const { handleSubmit: submitOrder, isSaving } = useOrderSubmission(formData, paymentMethod);
  
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handlePaymentMethodChange = (methodId: string) => {
    setPaymentMethod(methodId);
  };

  // Handle form submission wrapper for OrderSummary
  const onSubmitWrapper = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(submitOrder)();
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-2">Seu carrinho está vazio</h2>
        <p className="text-muted-foreground mb-4">Adicione itens ao seu carrinho antes de fazer o checkout.</p>
        <Button onClick={() => navigate('/')}>Voltar às compras</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-medium mb-2">Faça login para continuar</h2>
        <p className="text-muted-foreground mb-4">Você precisa estar logado para fazer um pedido.</p>
        <Button onClick={() => navigate('/register')}>Login / Cadastro</Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <CustomerInfoStep 
                register={register}
                errors={errors}
                nextStep={nextStep}
              />
            )}
            
            {currentStep === 2 && (
              <PaymentStep 
                paymentMethod={paymentMethod}
                paymentMethods={paymentMethods}
                handlePaymentMethodChange={handlePaymentMethodChange}
                prevStep={prevStep}
                isSaving={isSaving}
              />
            )}
            
            {currentStep === 3 && (
              <OrderConfirmation 
                formData={formData}
                paymentMethod={paymentMethod}
                paymentMethods={paymentMethods}
                items={items}
                total={total}
                prevStep={prevStep}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <OrderSummary 
          onSubmit={onSubmitWrapper}
          currentStep={currentStep}
          canProceed={currentStep === 2 && !!paymentMethod}
        />
      </div>
    </div>
  );
};

export default CheckoutContent;
