
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from "./components/ui/theme-provider";
import Index from './pages/Index';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Domains from './pages/Domains';
import CpanelHosting from './pages/CpanelHosting';
import WordPressHosting from './pages/WordPressHosting';
import CpanelHostingPurchase from './pages/CpanelHostingPurchase';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { AdminRoute } from '@/components/AdminRoute';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  const { loading } = useSupabaseAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-react-theme"
    >
      <Toaster />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/domains" element={<Domains />} />
        <Route path="/products/cpanel" element={<CpanelHosting />} />
        <Route path="/products/wordpress" element={<WordPressHosting />} />
        <Route path="/terms" element={<NotFound />} />
        <Route path="/privacy" element={<NotFound />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        
        {/* Client Routes */}
        <Route path="/client" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        <Route path="/client/services" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        <Route path="/client/invoices" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        <Route path="/client/orders" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
        <Route path="/client/profile" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/invoices" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/products/add" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/service-plans" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/service-plans/add" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/service-plans/edit/:id" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/hosting" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/hosting/create" element={<AdminRoute><NotFound /></AdminRoute>} />
        <Route path="/admin/hosting/edit/:id" element={<AdminRoute><NotFound /></AdminRoute>} />

        {/* CPanel Hosting Purchase Route */}
        <Route path="/products/cpanel/purchase" element={<CpanelHostingPurchase />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
