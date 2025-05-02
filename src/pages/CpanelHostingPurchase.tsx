
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useHostingPlans } from "@/hooks/useHostingPlans";
import HostingPricingSection from "@/components/hosting/HostingPricingSection";
import HostingHeader from "@/components/hosting/HostingHeader";
import HostingFeatures from "@/components/hosting/HostingFeatures";
import HostingCTA from "@/components/hosting/HostingCTA";
import DomainDialog from "@/components/hosting/DomainDialog";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const CpanelHostingPurchase = () => {
  const navigate = useNavigate();
  const { hostingPlans } = useHostingPlans();
  const { addToCart } = useCart();
  const [billingYears, setBillingYears] = useState("1");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [dialogTab, setDialogTab] = useState("register");
  const [domainName, setDomainName] = useState("");
  const [isDomainValid, setIsDomainValid] = useState(false);

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const handleDomainValidated = (domain: string) => {
    setDomainName(domain);
    setIsDomainValid(true);
  };

  const handleAddToCart = () => {
    if (!selectedPlan) return;

    // Calculate price based on plan and years
    const years = parseInt(billingYears);
    const totalPrice = selectedPlan.basePrice * years;
    
    // Add to cart with all necessary details
    addToCart({
      id: uuidv4(),
      title: selectedPlan.title,
      quantity: 1,
      price: totalPrice,
      basePrice: selectedPlan.basePrice,
      type: "hosting",
      domain: dialogTab === "register" ? domainName : undefined,
      description: `${selectedPlan.title} - ${billingYears} ${parseInt(billingYears) === 1 ? 'ano' : 'anos'}`,
      years: years
    });

    // If also registering a domain, add it to cart
    if (dialogTab === "register" && domainName) {
      addToCart({
        id: uuidv4(),
        title: `Domínio ${domainName}`,
        quantity: 1,
        price: 5000,
        basePrice: 5000,
        type: "domain",
        domain: domainName,
        description: `Registro de domínio para ${years} ${years === 1 ? 'ano' : 'anos'}`,
        years: years
      });
    }

    toast.success("Plano de hospedagem adicionado ao carrinho!");
    setShowDialog(false);
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="container py-8">
        <HostingHeader 
          title="Hospedagem cPanel"
          description="Hospedagem web confiável e de alta performance com painel cPanel"
        />
        
        <HostingPricingSection
          billingYears={billingYears}
          setBillingYears={setBillingYears}
          hostingPlans={hostingPlans}
          onPlanSelect={handlePlanSelect}
        />
        
        <HostingFeatures />
        
        <HostingCTA />
      </div>

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

export default CpanelHostingPurchase;
