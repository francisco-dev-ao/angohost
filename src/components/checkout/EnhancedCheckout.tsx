
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { executeQuery } from '@/utils/database';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription, Card, CardHeader, CardContent } from '@/components/ui/card';
import OrderSummary from './OrderSummary';
import CheckoutForm from './CheckoutForm';

const EnhancedCheckout = () => {
  const { items, total, clearCart } = useCart();
  const { user, signIn } = useSupabaseAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [items, navigate, orderPlaced]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await signIn(loginEmail, loginPassword);
      setAuthVisible(false);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro no login: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitOrder = async (formData: any) => {
    if (!user) {
      setAuthVisible(true);
      return;
    }

    try {
      setLoading(true);
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create order in database
      const { success, data, error } = await executeQuery(
        `INSERT INTO orders (
          order_number, user_id, items, total_amount, status, 
          payment_method, contact_profile_id, client_details
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id`,
        [
          orderNumber,
          user.id,
          JSON.stringify(items),
          total,
          'pending',
          formData.paymentMethod,
          formData.contactProfileId,
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address
          })
        ]
      );
      
      if (!success || error) {
        throw new Error(error || 'Falha ao criar pedido');
      }

      // Clear cart and show success message
      setOrderPlaced(true);
      clearCart();
      toast.success('Pedido realizado com sucesso!');
      
      // Redirect to order confirmation
      setTimeout(() => {
        navigate(`/client/orders?id=${data[0].id}`);
      }, 2000);
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(`Erro ao finalizar compra: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Pedido realizado com sucesso!</CardTitle>
            <CardDescription>
              Seu pedido foi recebido e está sendo processado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Você será redirecionado para a página de pedidos em instantes.
            </p>
            <Button onClick={() => navigate('/client/orders')}>
              Ver meus pedidos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {authVisible ? (
            <Card>
              <CardHeader>
                <CardTitle>Acesse sua conta</CardTitle>
                <CardDescription>
                  Para continuar com a compra, faça login ou crie uma conta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Senha
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processando...' : 'Entrar'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/auth')}
                    >
                      Criar conta
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <CheckoutForm onSubmit={handleSubmitOrder} loading={loading} />
          )}
        </div>
        <div>
          <OrderSummary items={items} total={total} />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;
