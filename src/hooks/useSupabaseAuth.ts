
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Session } from '@supabase/supabase-js';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
        } else {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error('Unexpected error during session fetch:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (data.user) {
        toast.success('Login successful!');
        return data.user;
      } else {
        throw new Error('Login failed with no error');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, fullName: string): Promise<User> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      if (data.user) {
        return data.user;
      } else {
        throw new Error('Signup failed with no error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success('Logout successful');
      return true;
    } catch (error) {
      console.error('Signout error:', error);
      throw error;
    }
  };
  
  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    resetPassword,
    signOut
  };
}
