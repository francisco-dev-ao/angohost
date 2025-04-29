
import React from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import ClientSidebar from "@/components/client/ClientSidebar";
import ClientDashboard from "@/components/client/ClientDashboard";
import ProfilePage from "@/components/client/ProfilePage";
import DomainsPage from "@/components/client/DomainsPage";
import ServicesPage from "@/components/client/ServicesPage";
import InvoicesPage from "@/components/client/InvoicesPage";
import PaymentMethodsPage from "@/components/client/PaymentMethodsPage";
import SupportPage from "@/components/client/SupportPage";
import NotificationsPage from "@/components/client/NotificationsPage";
import PromotionsPage from "@/components/client/PromotionsPage";
import OrdersPage from "@/components/client/OrdersPage";
import ContactProfilesPage from "@/components/client/ContactProfilesPage";

const ClientArea = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      toast.error('Faça login para acessar a área do cliente');
      navigate('/register');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <p>Por favor, aguarde enquanto carregamos suas informações.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen w-full">
      <ClientSidebar />
      
      <div className="flex-1">
        <div className="container py-8">
          <Routes>
            <Route path="/" element={<ClientDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/domains" element={<DomainsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/contact-profiles" element={<ContactProfilesPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ClientArea;
