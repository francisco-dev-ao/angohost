
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
  const [dbConnectionStatus, setDbConnectionStatus] = useState<{success?: boolean, message?: string}>({});
  
  useEffect(() => {
    // Testar a conexão com o banco de dados ao carregar a página
    const checkDbConnection = async () => {
      try {
        const result = await testDatabaseConnection();
        if (result.success) {
          setDbConnectionStatus({
            success: true,
            message: "Conectado ao banco de dados com sucesso!"
          });
          // Mostrar notificação de sucesso
          toast.success("Conectado ao banco de dados PostgreSQL com sucesso!");
        } else {
          setDbConnectionStatus({
            success: false,
            message: `Erro na conexão: ${result.error}`
          });
          // Mostrar notificação de erro
          toast.error(`Falha na conexão com o banco de dados: ${result.error}`);
        }
      } catch (err) {
        console.error("Erro ao testar conexão:", err);
        setDbConnectionStatus({
          success: false,
          message: `Exceção: ${err.message}`
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
