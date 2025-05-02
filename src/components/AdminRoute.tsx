
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ returnUrl: '/admin' }} replace />;
  }

  // Check if the user is an admin
  const isAdmin = user.user_metadata?.role === 'admin' || user.email?.endsWith('@admin.com');

  if (!isAdmin) {
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};
