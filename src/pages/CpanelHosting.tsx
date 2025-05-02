
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import HostingHeader from "@/components/hosting/HostingHeader";
import HostingPricingSection from "@/components/hosting/HostingPricingSection";
import HostingFeatures from "@/components/hosting/HostingFeatures";
import HostingCTA from "@/components/hosting/HostingCTA";
import DomainDialog from "@/components/hosting/DomainDialog";
import { useHostingPlans } from "@/hooks/useHostingPlans";
import { useDomainSelection } from "@/hooks/useDomainSelection";

const CpanelHosting = () => {
  const [billingYears, setBillingYears] = useState("1");
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { hostingPlans } = useHostingPlans();
  const {
    showDialog,
    setShowDialog,
    dialogTab,
    setDialogTab,
    domainName,
    isDomainValid,
    selectedPlan,
    handlePlanSelect,
    handleDomainValidated
  } = useDomainSelection();
  
  const handleAddToCart = () => {
    if (!selectedPlan) return;
    
    if (dialogTab === "register") {
      // Adding hosting with domain registration
      if (!isDomainValid) {
        toast.error("Por favor, verifique a disponibilidade do domínio primeiro");
        return;
      }
      
      // First add domain to cart
      addToCart({
        id: `domain-${Date.now()}`,
        title: `Domínio ${domainName}`,
        price: 5000, // Domain registration price
        basePrice: 5000,
        quantity: 1,
        type: 'domain',
        years: parseInt(billingYears),
        domain: domainName
      });
      
      toast.success(`Domínio ${domainName} adicionado ao carrinho`);
    }
    
    // Add the hosting plan to cart
    const hostingItem = {
      id: `hosting-${Date.now()}`,
      title: `Hospedagem ${selectedPlan.title}`,
      price: calculateYearlyPrice(selectedPlan.basePrice, parseInt(billingYears)),
      basePrice: selectedPlan.basePrice,
      quantity: 1,
      type: 'hosting',
      years: parseInt(billingYears),
      description: selectedPlan.description,
      domain: dialogTab === "register" ? domainName : undefined
    };
    
    addToCart(hostingItem);
    toast.success(`Plano ${selectedPlan.title} adicionado ao carrinho`);
    setShowDialog(false);
    
    // Navigate to cart
    navigate("/cart");
  };
  
  // Calculate price with multi-year discounts - needed for the cart
  const calculateYearlyPrice = (basePrice: number, years: number) => {
    let discount = 0;
    if (years > 1) {
      discount = (years - 1) * 0.05;
    }
    return Math.round(basePrice * years * (1 - discount));
  };

  return (
    <Layout>
      <HostingHeader />
      
      <HostingPricingSection 
        billingYears={billingYears}
        setBillingYears={setBillingYears}
        hostingPlans={hostingPlans}
        onPlanSelect={handlePlanSelect}
      />
      
      <HostingFeatures />
      
      <HostingCTA />
      
      <DomainDialog 
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        dialogTab={dialogTab}
        setDialogTab={setDialogTab}
        domainName={domainName}
        isDomainValid={isDomainValid}
        onDomainValidated={handleDomainValidated}
        handleAddToCart={handleAddToCart}
      />
    </Layout>
  );
};

export default CpanelHosting;
