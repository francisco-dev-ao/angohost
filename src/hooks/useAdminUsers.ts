
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminUser } from '@/types/admin';

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users from profiles table
      const { data, error, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });

      if (error) throw error;
      
      const formattedUsers: AdminUser[] = data.map(user => ({
        id: user.id,
        email: user.email || '',
        fullName: user.full_name || '',
        role: user.role || 'customer',
        isActive: user.is_active, 
        createdAt: user.created_at
      }));
      
      setUsers(formattedUsers);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast.error('Erro ao carregar usuários: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'support' | 'finance' | 'customer') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Função do usuário atualizada com sucesso');
      fetchUsers(); // Reload users
    } catch (error: any) {
      toast.error('Erro ao atualizar função: ' + error.message);
    }
  };

  const createUser = async (email: string, password: string, fullName: string, role: 'admin' | 'support' | 'finance' | 'customer') => {
    try {
      // First create the auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      // If successful, update the profile record with role
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role })
          .eq('id', data.user.id);

        if (profileError) throw profileError;
      }

      toast.success('Usuário criado com sucesso');
      fetchUsers(); // Reload users
      return data;
    } catch (error: any) {
      toast.error('Erro ao criar usuário: ' + error.message);
      throw error;
    }
  };

  const updateUser = async (userId: string, userData: { fullName?: string; role?: 'admin' | 'support' | 'finance' | 'customer'; isActive?: boolean }) => {
    try {
      const updateData: any = {};
      if (userData.fullName !== undefined) updateData.full_name = userData.fullName;
      if (userData.role !== undefined) updateData.role = userData.role;
      if (userData.isActive !== undefined) updateData.is_active = userData.isActive;

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Usuário atualizado com sucesso');
      fetchUsers(); // Reload users
    } catch (error: any) {
      toast.error('Erro ao atualizar usuário: ' + error.message);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // First, delete the user from Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) {
        console.error('Error deleting user from auth:', authError);
        // If we can't delete from auth directly, try deleting profile first
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);

        if (profileError) throw profileError;
      }
      
      toast.success('Usuário excluído com sucesso');
      fetchUsers(); // Reload users
    } catch (error: any) {
      toast.error('Erro ao excluir usuário: ' + error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Set up realtime subscription for user updates
    const usersChannel = supabase
      .channel('admin-users-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Users updated in real-time');
          fetchUsers();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(usersChannel);
    };
  }, []);

  return { 
    users, 
    isLoading, 
    totalCount, 
    fetchUsers, 
    updateUserRole,
    createUser,
    updateUser,
    deleteUser
  };
};
