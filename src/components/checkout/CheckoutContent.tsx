
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ClientStep from './steps/ClientStep';
import ServiceStep from './steps/ServiceStep';
import PaymentStep from './steps/PaymentStep';
import { motion } from 'framer-motion';

interface CheckoutContentProps {
  activeStep: string;
  completedSteps: Record<string, boolean>;
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>>;
  nextStep: () => void;
  prevStep: () => void;
  items: any[];
  handleRemoveItem: (id: string) => void;
  handleUpdateBillingCycle: (itemId: string, years: number) => void;
  paymentMethod: string | null;
  paymentMethods: any[];
  handlePaymentMethodChange: (methodId: string) => void;
  isSaving: boolean;
  setActiveStep: (step: string) => void;
}

const CheckoutContent: React.FC<CheckoutContentProps> = ({
  activeStep,
  completedSteps,
  formData,
  setFormData,
  nextStep,
  prevStep,
  items,
  handleRemoveItem,
  handleUpdateBillingCycle,
  paymentMethod,
  paymentMethods,
  handlePaymentMethodChange,
  isSaving,
  setActiveStep,
}) => {
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="md:col-span-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
        <TabsContent value="client">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent className="pt-6">
                <ClientStep
                  formData={formData}
                  setFormData={setFormData}
                  nextStep={nextStep}
                  completedSteps={completedSteps}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="service">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent className="pt-6">
                <ServiceStep
                  items={items}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  onRemoveItem={handleRemoveItem}
                  onUpdateBillingCycle={handleUpdateBillingCycle}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="payment">
          <motion.div
            variants={tabVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardContent className="pt-6">
                <PaymentStep
                  paymentMethod={paymentMethod}
                  paymentMethods={paymentMethods}
                  handlePaymentMethodChange={handlePaymentMethodChange}
                  prevStep={prevStep}
                  isSaving={isSaving}
                />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CheckoutContent;
