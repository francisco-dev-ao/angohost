
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
  const [dbConnectionStatus, setDbConnectionStatus] = useState<{success?: boolean, message?: string, loading?: boolean, error?: string}>({
    loading: true
  });
  
  useEffect(() => {
    // Test the database connection when the page loads
    const checkDbConnection = async () => {
      try {
        console.log('Verificando conexão com o banco de dados...');
        setDbConnectionStatus(prev => ({ ...prev, loading: true }));
        
        // Use mock data in development mode if enabled
        if (import.meta.env.DEV) {
          console.log('Usando modo de desenvolvimento, configurando dados simulados');
          // Mock successful response for development
          const mockResult = {
            success: true,
            message: "Conexão simulada em modo de desenvolvimento"
          };
          
          setDbConnectionStatus({
            success: mockResult.success,
            message: mockResult.message,
            loading: false
          });
          
          toast.success("Usando dados simulados em modo de desenvolvimento");
          return;
        }

        // Try actual database connection
        console.log('Chamando API para testar conexão...');
        const result = await testDatabaseConnection();
        console.log('Resultado da conexão:', result);
        
        setDbConnectionStatus({
          success: result.success,
          message: result.success 
            ? "Conectado ao banco de dados com sucesso!" 
            : `Erro na conexão: ${result.error}`,
          error: result.error,
          loading: false
        });
        
        // Show appropriate notification
        if (result.success) {
          toast.success("Conectado ao banco de dados PostgreSQL com sucesso!");
        } else {
          toast.info(`Não foi possível conectar ao banco de dados. Usando dados locais.`);
        }
      } catch (err: any) {
        console.error("Erro ao testar conexão:", err);
        setDbConnectionStatus({
          success: false,
          message: `Exceção: ${err.message}`,
          error: err.message,
          loading: false
        });
        toast.info(`Usando dados locais para exibição do site`);
      }
    };
    
    checkDbConnection();
  }, []);

  // Exibe informações de depuração apenas em desenvolvimento
  const renderDebugInfo = () => {
    if (import.meta.env.DEV) {
      return (
        <div className="container mx-auto mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Informações de Depuração:</h3>
          <p><strong>Ambiente:</strong> {import.meta.env.MODE}</p>
          <p><strong>Status de Conexão:</strong> {dbConnectionStatus.loading ? 'Verificando...' : dbConnectionStatus.success ? 'Conectado' : 'Usando dados locais'}</p>
          {dbConnectionStatus.message && <p><strong>Mensagem:</strong> {dbConnectionStatus.message}</p>}
          {!dbConnectionStatus.success && !dbConnectionStatus.loading && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <h4 className="font-medium text-amber-700">Aviso:</h4>
              <p className="text-sm mt-1">O site está funcionando com dados locais pois não foi possível conectar ao banco de dados. Todas as funcionalidades estão disponíveis para visualização.</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      {renderDebugInfo()}
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
