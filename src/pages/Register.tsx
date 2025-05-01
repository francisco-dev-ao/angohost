
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function Register() {
  const [tab, setTab] = useState('register');
  const location = useLocation();
  const returnUrl = location.state?.returnUrl || '/client';
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { signIn, signUp, user } = useSupabaseAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      toast.success('Você já está logado');
      navigate(returnUrl);
    }
  }, [user, navigate, returnUrl]);
  
  const handleLogin = async (email: string, password: string) => {
    setIsLoggingIn(true);
    try {
      await signIn(email, password);
      toast.success('Login realizado com sucesso');
      navigate(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Erro ao realizar login');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (email: string, password: string, fullName: string) => {
    setIsRegistering(true);
    try {
      await signUp(email, password, fullName);
      toast.success('Cadastro realizado com sucesso');
      navigate(returnUrl);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Erro ao realizar cadastro');
    } finally {
      setIsRegistering(false);
    }
  };

  const loginTitle = "Acesse a sua conta";
  const loginSubtitle = "Bem-vindo de volta! Por favor, insira seus detalhes.";
  const registerTitle = "Criar nova conta";
  const registerSubtitle = "Por favor, insira seus dados";

  return (
    <AuthLayout 
      title={tab === 'login' ? loginTitle : registerTitle}
      subtitle={tab === 'login' ? loginSubtitle : registerSubtitle}
    >
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login" className="text-gray-700">Entrar</TabsTrigger>
          <TabsTrigger value="register" className="text-gray-700">Criar Conta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onSubmit={handleLogin} isLoading={isLoggingIn} />
          
          <div className="mt-6">
            <button 
              onClick={() => setTab('register')} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl text-sm"
            >
              Criar nova conta
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="register">
          <RegisterForm onSubmit={handleRegister} isLoading={isRegistering} />
          
          <div className="mt-6">
            <button 
              onClick={() => setTab('login')} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-xl text-sm"
            >
              Entrar na minha conta
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}
