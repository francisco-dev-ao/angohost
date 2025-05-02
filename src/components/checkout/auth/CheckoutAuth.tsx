
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface CheckoutAuthProps {
  onAuthComplete: () => void;
}

const CheckoutAuth = ({ onAuthComplete }: CheckoutAuthProps) => {
  const { signIn } = useSupabaseAuth();
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await signIn(loginEmail, loginPassword);
      toast.success('Login realizado com sucesso!');
      onAuthComplete();
    } catch (error: any) {
      toast.error(`Erro no login: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default CheckoutAuth;
