
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ClientLayout from '@/components/client/ClientLayout';
import ClientDashboard from '@/components/client/ClientDashboard';
import ServicesPage from '@/components/client/ServicesPage';
import DomainsPage from '@/components/client/DomainsPage';
import InvoicesPage from '@/components/client/InvoicesPage';
import SupportPage from '@/components/client/SupportPage';
import NotificationsPage from '@/components/client/NotificationsPage';
import ProfilePage from '@/components/client/ProfilePage';
import OrdersPage from '@/components/client/OrdersPage';
import PaymentMethodsPage from '@/components/client/PaymentMethodsPage';
import PromotionsPage from '@/components/client/PromotionsPage';
import ContactProfilesPage from '@/components/client/ContactProfilesPage';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const ClientArea = () => {
  const auth = useSupabaseAuth();
  // Change from isLoading to loading to match the actual property name
  const isLoading = auth.loading;
  const { user } = auth;

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/register" replace />;
  }

  // Loading state
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<ClientDashboard />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="domains" element={<DomainsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="payment-methods" element={<PaymentMethodsPage />} />
        <Route path="promotions" element={<PromotionsPage />} />
        <Route path="contact-profiles" element={<ContactProfilesPage />} />
      </Route>
    </Routes>
  );
};

export default ClientArea;
