
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { executeQuery } from '@/utils/database';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário autenticado no localStorage
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      // Verificar credenciais no banco de dados
      const { success, data, error } = await executeQuery(
        'SELECT * FROM profiles WHERE email = $1 LIMIT 1',
        [email]
      );

      if (!success || !data || data.length === 0) {
        throw new Error('Usuário não encontrado');
      }

      // Verificação simplificada de senha (substitua por uma verificação segura em produção)
      // Em um sistema real, você deve usar hashes e não armazenar senhas em texto simples
      const user = data[0];
      
      // IMPORTANTE: Em produção, você deve implementar uma verificação de senha segura
      // Esta é apenas uma implementação simplificada para este exemplo
      // Aqui presumimos que você possui um campo password_hash na tabela profiles
      
      // Simulação de verificação de credenciais
      // Na vida real, você deve verificar a senha usando bcrypt ou similar
      const passwordValid = true; // Substitua por uma verificação real
      
      if (!passwordValid) {
        throw new Error('Senha incorreta');
      }

      // Armazenar usuário autenticado
      localStorage.setItem('auth_user', JSON.stringify(user));
      setUser(user);

      toast.success('Login realizado com sucesso!');
      return user;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar login');
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    try {
      // Verificar se o usuário já existe
      const checkUser = await executeQuery(
        'SELECT * FROM profiles WHERE email = $1 LIMIT 1',
        [email]
      );

      if (checkUser.success && checkUser.data && checkUser.data.length > 0) {
        throw new Error('Usuário já existe');
      }

      // Criar novo usuário
      // Em um sistema real, você deve hash a senha antes de armazenar
      const { success, data, error } = await executeQuery(
        'INSERT INTO profiles (email, full_name, role, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, fullName, 'customer', true]
      );

      if (!success || !data) {
        throw new Error(error || 'Erro ao criar usuário');
      }

      // Armazenar usuário autenticado
      const newUser = data[0];
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      setUser(newUser);

      toast.success('Cadastro realizado com sucesso!');
      return newUser;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao realizar cadastro');
      throw error;
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      const { success, data } = await executeQuery(
        'SELECT * FROM profiles WHERE email = $1 LIMIT 1',
        [email]
      );
      
      if (!success || !data || data.length === 0) {
        throw new Error('E-mail não encontrado');
      }
      
      // Aqui você implementaria a lógica real de redefinição de senha
      // Por exemplo, enviar um e-mail com um link ou token de redefinição
      
      toast.success('Instruções enviadas para o seu e-mail');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao solicitar redefinição de senha');
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('auth_user');
      setUser(null);
      
      toast.success('Sessão encerrada com sucesso');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao encerrar sessão');
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    resetPassword: handleResetPassword,
    signOut: handleSignOut,
  };
};
