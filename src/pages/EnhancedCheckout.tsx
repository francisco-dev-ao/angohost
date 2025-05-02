
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import EnhancedCheckout from '@/components/checkout/EnhancedCheckout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import PromotionalBanner from '@/components/checkout/PromotionalBanner';
import CountdownTimer from '@/components/checkout/CountdownTimer';

const EnhancedCheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, isLoading } = useCart();
  const { user } = useSupabaseAuth();
  
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showStickyBanner, setShowStickyBanner] = useState(false);
  
  const { signIn, signUp } = useSupabaseAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowStickyBanner(scrollPosition > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setIsAuthenticating(true);
    try {
      await signIn(email, password);
      toast.success('Login realizado com sucesso');
      setIsAuthDialogOpen(false);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsAuthenticating(false);
    }
  };
  
  const handleRegister = async (email: string, password: string, fullName: string) => {
    setIsAuthenticating(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Cadastro realizado com sucesso');
      setIsAuthDialogOpen(false);
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.message.includes('already registered')) {
        toast.error('Este e-mail já está cadastrado. Faça login.');
      } else {
        toast.error('Erro ao realizar cadastro');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Skeleton className="w-full h-64" />
              <Skeleton className="w-full h-64" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </Layout>
    );
  }

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-12">
          <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-lg shadow-sm">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
            <p className="text-muted-foreground mb-8">Não há itens no seu carrinho para finalizar a compra.</p>
            <div className="space-y-4">
              <Button onClick={() => navigate('/domains')} className="px-8">
                Pesquisar domínios
              </Button>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="px-8"
                >
                  Continuar explorando
                </Button>
              </div>
            </div>
          </div>
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

          {!user ? (
            <div className="mb-8 p-6 border border-amber-200 bg-amber-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">Faça login para continuar com a compra</h3>
                  <p className="text-muted-foreground">Para finalizar sua compra, você precisa fazer login ou criar uma conta</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => {
                    setAuthTab('login');
                    setIsAuthDialogOpen(true);
                  }}>
                    Fazer login
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setAuthTab('register');
                    setIsAuthDialogOpen(true);
                  }}>
                    Criar conta
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
          
          <EnhancedCheckout />
        </div>
        <div className="container mt-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-medium mb-4">Métodos de Pagamento Aceitos</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <img src="/placeholder.svg" alt="Método de Pagamento" className="h-8" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Authentication Dialog */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{authTab === 'login' ? 'Acesse sua conta' : 'Criar nova conta'}</DialogTitle>
          </DialogHeader>
          
          <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="text-gray-700">Entrar</TabsTrigger>
              <TabsTrigger value="register" className="text-gray-700">Criar Conta</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSubmit={handleLogin} isLoading={isAuthenticating} />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSubmit={handleRegister} isLoading={isAuthenticating} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EnhancedCheckoutPage;
