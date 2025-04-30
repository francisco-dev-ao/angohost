
import React, { useEffect, useState } from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import PricingTabsSection from "@/components/home/PricingTabsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SupportSection from "@/components/home/SupportSection";
import CtaSection from "@/components/home/CtaSection";
import DomainSearchSection from "@/components/home/DomainSearchSection";
import Layout from "@/components/Layout";
import TrustpilotSection from "@/components/home/TrustpilotSection";
import PartnerLogos from "@/components/home/PartnerLogos";
import { testDatabaseConnection } from "@/utils/database";
import { toast } from "sonner";

const Index = () => {
  const [dbConnectionStatus, setDbConnectionStatus] = useState<{success?: boolean, message?: string, loading?: boolean}>({
    loading: true
  });
  
  useEffect(() => {
    // Test the database connection when the page loads
    const checkDbConnection = async () => {
      try {
        setDbConnectionStatus(prev => ({ ...prev, loading: true }));
        
        // In development mode with mock enabled, use mock data if available
        if (import.meta.env.MODE === 'development' && 
            import.meta.env.VITE_USE_MOCK_DB === 'true' && 
            typeof window !== 'undefined' && 
            (window as any).__mockDbResponses) {
          const mockResult = (window as any).__mockDbResponses.testConnection;
          setDbConnectionStatus({
            success: mockResult.success,
            message: mockResult.message,
            loading: false
          });
          toast.success(mockResult.message);
          return;
        }

        // Attempt real database connection via API
        const result = await testDatabaseConnection();
        
        setDbConnectionStatus({
          success: result.success,
          message: result.success 
            ? "Conectado ao banco de dados com sucesso!" 
            : `Erro na conexão: ${result.error}`,
          loading: false
        });
        
        // Show appropriate notification
        if (result.success) {
          toast.success("Conectado ao banco de dados PostgreSQL com sucesso!");
        } else {
          toast.error(`Falha na conexão com o banco de dados: ${result.error}`);
        }
      } catch (err: any) {
        console.error("Erro ao testar conexão:", err);
        setDbConnectionStatus({
          success: false,
          message: `Exceção: ${err.message}`,
          loading: false
        });
        toast.error(`Erro ao tentar conectar: ${err.message}`);
      }
    };
    
    checkDbConnection();
  }, []);

  return (
    <Layout>
      <HeroSection />
      <DomainSearchSection />
      <PricingTabsSection />
      <TrustpilotSection />
      <PartnerLogos />
      <ServicesSection />
      <TestimonialsSection />
      <SupportSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
