
import React from 'react';
import Layout from '@/components/Layout';
import EnhancedCheckout from '@/components/checkout/EnhancedCheckout';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import PromotionalBanner from '@/components/checkout/PromotionalBanner';
import CountdownTimer from '@/components/checkout/CountdownTimer';
import CheckoutSkeleton from '@/components/checkout/CheckoutSkeleton';
import EmptyCartView from '@/components/checkout/EmptyCartView';
import LoginPrompt from '@/components/checkout/LoginPrompt';
import AuthDialog from '@/components/checkout/AuthDialog';
import PaymentMethodsDisplay from '@/components/checkout/PaymentMethodsDisplay';
import { useAuthDialog } from '@/hooks/useAuthDialog';
import { useScrollBehavior } from '@/hooks/useScrollBehavior';

const EnhancedCheckoutPage = () => {
  const { items, isLoading } = useCart();
  const { user } = useSupabaseAuth();
  const { showStickyBanner } = useScrollBehavior();
  
  const {
    isAuthDialogOpen,
    setIsAuthDialogOpen,
    authTab,
    setAuthTab,
    isAuthenticating,
    handleLogin,
    handleRegister,
    openLoginDialog,
    openRegisterDialog
  } = useAuthDialog();

  if (isLoading) {
    return (
      <Layout>
        <CheckoutSkeleton />
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <EmptyCartView />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {showStickyBanner && (
        <PromotionalBanner isSticky={true} className="shadow-md" />
      )}
      
      <motion.div 
        className="bg-gradient-to-b from-gray-50 to-white min-h-[80vh] py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          {items.length > 0 && (
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-4">
                <CountdownTimer initialMinutes={7} message="Não perca esta oferta!" />
                <PromotionalBanner />
              </div>
            </div>
          )}

          {!user && (
            <LoginPrompt 
              onLogin={openLoginDialog} 
              onRegister={openRegisterDialog}
            />
          )}
          
          <EnhancedCheckout />
        </div>
        
        <PaymentMethodsDisplay />
      </motion.div>

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onOpenChange={setIsAuthDialogOpen}
        authTab={authTab}
        setAuthTab={setAuthTab}
        isAuthenticating={isAuthenticating}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </Layout>
  );
};

export default EnhancedCheckoutPage;
