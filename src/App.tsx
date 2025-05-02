
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './components/ui/sidebar';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './components/ui/theme-provider';

// Import pages that exist in the read-only files
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Auth from './pages/Auth';
import Index from './pages/Index';
import Domains from './pages/Domains';
import Checkout from './pages/Checkout';
import EnhancedCheckout from './pages/EnhancedCheckout';
import AdminIndex from './pages/AdminIndex';
import AdminDomains from './pages/admin/AdminDomains';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminDomainExtensions from './pages/admin/AdminDomainExtensions';
import AdminServicePlans from './pages/admin/AdminServicePlans';
import AdminPageContents from './pages/admin/AdminPageContents';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminOrders from './pages/admin/AdminOrders';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminAbandonedCarts from './pages/admin/AdminAbandonedCarts';
import AdminEmailTemplates from './pages/admin/AdminEmailTemplates';
import AdminSettings from './pages/admin/AdminSettings';
import AdminPaymentMethods from './pages/admin/AdminPaymentMethods';

// Import client pages
import ClientLayout from './pages/client/ClientLayout';
import ClientDomains from './pages/client/ClientDomains';
import ClientProfile from './pages/client/ClientProfile';
import ClientServices from './pages/client/ClientServices';
import ClientArea from './pages/ClientArea';
import ClientInvoices from './pages/client/ClientInvoices';
import CpanelHosting from './pages/CpanelHosting';
import ProfessionalEmail from './pages/ProfessionalEmail';
import ExchangeOnline from './pages/ExchangeOnline';
import VpsHosting from './pages/VpsHosting';
import WordPressHosting from './pages/WordPressHosting';
import DedicatedServers from './pages/DedicatedServers';
import DomainTransfer from './pages/DomainTransfer';

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/domains" element={<Domains />} />
            <Route path="/domain-transfer" element={<DomainTransfer />} />
            <Route path="/cpanel-hosting" element={<CpanelHosting />} />
            <Route path="/wordpress-hosting" element={<WordPressHosting />} />
            <Route path="/vps-hosting" element={<VpsHosting />} />
            <Route path="/dedicated-servers" element={<DedicatedServers />} />
            <Route path="/professional-email" element={<ProfessionalEmail />} />
            <Route path="/exchange-online" element={<ExchangeOnline />} />
            <Route path="/hosting" element={<CpanelHosting />} />
            <Route path="/email" element={<ProfessionalEmail />} />
            <Route path="/vps" element={<VpsHosting />} />
            
            {/* Redirect cart to enhanced-checkout */}
            <Route path="/cart" element={<Navigate to="/enhanced-checkout" replace />} />
            
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Navigate to="/auth" replace />} /> {/* Redirecting to new Auth page */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enhanced-checkout" element={<EnhancedCheckout />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminProtectedRoute><AdminIndex /></AdminProtectedRoute>} />
            <Route path="/admin/domains" element={<AdminProtectedRoute><AdminDomains /></AdminProtectedRoute>} />
            <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
            <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
            <Route path="/admin/domain-extensions" element={<AdminProtectedRoute><AdminDomainExtensions /></AdminProtectedRoute>} />
            <Route path="/admin/service-plans" element={<AdminProtectedRoute><AdminServicePlans /></AdminProtectedRoute>} />
            <Route path="/admin/page-contents" element={<AdminProtectedRoute><AdminPageContents /></AdminProtectedRoute>} />
            <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
            <Route path="/admin/invoices" element={<AdminProtectedRoute><AdminInvoices /></AdminProtectedRoute>} />
            <Route path="/admin/payment-methods" element={<AdminProtectedRoute><AdminPaymentMethods /></AdminProtectedRoute>} />
            <Route path="/admin/abandoned-carts" element={<AdminProtectedRoute><AdminAbandonedCarts /></AdminProtectedRoute>} />
            <Route path="/admin/email-templates" element={<AdminProtectedRoute><AdminEmailTemplates /></AdminProtectedRoute>} />
            <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />

            {/* Client Routes - Support both /client/* and direct access to /client-area */}
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<ClientDomains />} />
              <Route path="domains" element={<ClientDomains />} />
              <Route path="profile" element={<ClientProfile />} />
              <Route path="services" element={<ClientServices />} />
              <Route path="orders" element={<ClientArea />} />
              <Route path="invoices" element={<ClientInvoices />} />
            </Route>

            {/* Direct routes */}
            <Route path="/client-area" element={<ClientArea />} />
            <Route path="/client-area/*" element={<ClientArea />} />
            <Route path="/services" element={<Navigate to="/client/services" replace />} />
            <Route path="/orders" element={<Navigate to="/client/orders" replace />} />
            <Route path="/invoices" element={<Navigate to="/client/invoices" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarProvider>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
