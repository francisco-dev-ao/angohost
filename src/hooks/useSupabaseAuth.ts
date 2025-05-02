
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener para mudanças na autenticação primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Evento de autenticação:', event);
      setSession(session);
      setUser(session?.user || null);
      
      // Atualizar localStorage para compatibilidade com o código existente
      if (session?.user) {
        localStorage.setItem('auth_user', JSON.stringify(session.user));
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('auth_user');
      }
    });

    // Depois verificar autenticação atual
    const checkCurrentUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar usuário:', error);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user || null);
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        // Não exibir toast aqui para não interromper a experiência do usuário
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setUser(data.user);
      setSession(data.session);
      toast.success('Login realizado com sucesso!');
      return data.user;
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao realizar login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      
      // Registrar usuário com Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      // Após o registro, atualizar o perfil na tabela profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ 
            id: data.user.id, 
            email: email,
            full_name: fullName,
            role: 'customer',
            is_active: true
          });
          
        if (profileError) {
          console.error('Erro ao criar perfil:', profileError);
          // Continuamos mesmo se houver erro no perfil, pois a conta foi criada
        }
      }
      
      setUser(data.user);
      setSession(data.session);
      toast.success('Cadastro realizado com sucesso!');
      return data.user;
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      toast.error(error.message || 'Erro ao realizar cadastro');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      });
      
      if (error) throw error;
      
      toast.success('Instruções enviadas para o seu e-mail');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao solicitar redefinição de senha');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      localStorage.removeItem('auth_user');
      toast.success('Sessão encerrada com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao encerrar sessão');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    resetPassword: handleResetPassword,
    signOut: handleSignOut,
  };
};
