import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider"
import Index from './pages/Index';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientArea from './pages/client/ClientArea';
import ClientServices from './pages/client/ClientServices';
import ClientInvoices from './pages/client/ClientInvoices';
import ClientOrders from './pages/client/ClientOrders';
import ClientProfile from './pages/client/ClientProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminOrders from './pages/admin/AdminOrders';
import AdminServices from './pages/admin/AdminServices';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminProducts from './pages/admin/AdminProducts';
import AdminServicePlans from './pages/admin/AdminServicePlans';
import AdminHosting from './pages/admin/AdminHosting';
import AdminHostingCreate from './pages/admin/AdminHostingCreate';
import AdminHostingEdit from './pages/admin/AdminHostingEdit';
import AdminProductsAdd from './pages/admin/AdminProductsAdd';
import AdminProductsEdit from './pages/admin/AdminProductsEdit';
import AdminServicePlansAdd from './pages/admin/AdminServicePlansAdd';
import AdminServicePlansEdit from './pages/admin/AdminServicePlansEdit';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Domains from './pages/Domains';
import CpanelHosting from './pages/CpanelHosting';
import WordPressHosting from './pages/WordPressHosting';
import EmailMarketing from './pages/EmailMarketing';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminRoute } from '@/components/AdminRoute';
import CpanelHostingPurchase from './pages/CpanelHostingPurchase';

function App() {
  const { isLoading } = useSupabaseAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <BrowserRouter>
      <Toaster />
      <ThemeProvider
        defaultTheme="system"
        storageKey="vite-react-theme"
      >
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/products/cpanel" element={<CpanelHosting />} />
        <Route path="/products/wordpress" element={<WordPressHosting />} />
        <Route path="/products/email-marketing" element={<EmailMarketing />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Client Routes */}
        <Route path="/client" element={<ProtectedRoute><ClientArea /></ProtectedRoute>} />
        <Route path="/client/services" element={<ProtectedRoute><ClientServices /></ProtectedRoute>} />
        <Route path="/client/invoices" element={<ProtectedRoute><ClientInvoices /></ProtectedRoute>} />
        <Route path="/client/orders" element={<ProtectedRoute><ClientOrders /></ProtectedRoute>} />
        <Route path="/client/profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/invoices" element={<AdminRoute><AdminInvoices /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><AdminProductsAdd /></AdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminProductsEdit /></AdminRoute>} />
        <Route path="/admin/service-plans" element={<AdminRoute><AdminServicePlans /></AdminRoute>} />
        <Route path="/admin/service-plans/add" element={<AdminRoute><AdminServicePlansAdd /></AdminRoute>} />
        <Route path="/admin/service-plans/edit/:id" element={<AdminRoute><AdminServicePlansEdit /></AdminRoute>} />
        <Route path="/admin/hosting" element={<AdminRoute><AdminHosting /></AdminRoute>} />
        <Route path="/admin/hosting/create" element={<AdminRoute><AdminHostingCreate /></AdminRoute>} />
        <Route path="/admin/hosting/edit/:id" element={<AdminRoute><AdminHostingEdit /></AdminRoute>} />

        {/* Add the new purchase routes */}
        <Route path="/products/cpanel/purchase" element={<CpanelHostingPurchase />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
