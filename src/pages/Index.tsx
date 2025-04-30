
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
        
        // In development mode with mock enabled, use mock data if available
        if (import.meta.env.DEV && 
            import.meta.env.VITE_USE_MOCK_DB === 'true' && 
            typeof window !== 'undefined' && 
            (window as any).__mockDbResponses) {
          console.log('Usando dados simulados para conexão com o banco de dados');
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
          toast.error(`Falha na conexão com o banco de dados: ${result.error}`);
        }
      } catch (err: any) {
        console.error("Erro ao testar conexão:", err);
        setDbConnectionStatus({
          success: false,
          message: `Exceção: ${err.message}`,
          error: err.message,
          loading: false
        });
        toast.error(`Erro ao tentar conectar: ${err.message}`);
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
          <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || '/api (proxy)'}</p>
          <p><strong>Ambiente:</strong> {import.meta.env.MODE}</p>
          <p><strong>Status de Conexão:</strong> {dbConnectionStatus.loading ? 'Verificando...' : dbConnectionStatus.success ? 'Conectado' : 'Erro'}</p>
          {dbConnectionStatus.message && <p><strong>Mensagem:</strong> {dbConnectionStatus.message}</p>}
          {dbConnectionStatus.error && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <h4 className="font-medium text-red-700">Erro:</h4>
              <pre className="text-sm overflow-auto p-2 bg-gray-100 rounded mt-1">{dbConnectionStatus.error}</pre>
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
