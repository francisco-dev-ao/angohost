
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import HostingPricingSection from "@/components/hosting/HostingPricingSection";
import HostingFeatures from "@/components/hosting/HostingFeatures";
import HostingCTA from "@/components/hosting/HostingCTA";
import HostingHeader from "@/components/hosting/HostingHeader";
import { useHostingPlans } from "@/hooks/useHostingPlans";
import { Button } from "@/components/ui/button";

const CpanelHosting = () => {
  const navigate = useNavigate();
  const { hostingPlans } = useHostingPlans();
  const [billingYears, setBillingYears] = useState("1");

  const handlePlanSelect = (plan: any) => {
    navigate("/products/cpanel/purchase");
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <HostingHeader 
          title="Hospedagem cPanel"
          description="Hospedagem web confiável e de alta performance com painel cPanel"
        />
        
        <div className="mb-8 flex justify-center">
          <Button 
            onClick={() => navigate("/products/cpanel/purchase")} 
            size="lg" 
            className="bg-angohost-primary hover:bg-angohost-primary/90"
          >
            Ver Planos e Contratar
          </Button>
        </div>
        
        <HostingPricingSection
          billingYears={billingYears}
          setBillingYears={setBillingYears}
          hostingPlans={hostingPlans}
          onPlanSelect={handlePlanSelect}
        />
        
        <HostingFeatures />
        
        <HostingCTA />
      </div>
    </Layout>
  );
};

export default CpanelHosting;
