
import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

export const useAuthDialog = () => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const { signIn, signUp } = useSupabaseAuth();

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

  const openLoginDialog = () => {
    setAuthTab('login');
    setIsAuthDialogOpen(true);
  };

  const openRegisterDialog = () => {
    setAuthTab('register');
    setIsAuthDialogOpen(true);
  };

  return {
    isAuthDialogOpen,
    setIsAuthDialogOpen,
    authTab,
    setAuthTab,
    isAuthenticating,
    handleLogin,
    handleRegister,
    openLoginDialog,
    openRegisterDialog
  };
};
