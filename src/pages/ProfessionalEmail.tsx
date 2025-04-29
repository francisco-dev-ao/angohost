
import React from "react";
import Layout from "@/components/Layout";
import { useEmailPlans } from "@/hooks/useEmailPlans";
import EmailPlanConfigurator from "@/components/email/EmailPlanConfigurator";
import EmailPlanGrid from "@/components/email/EmailPlanGrid";
import EmailFeatureSection from "@/components/email/EmailFeatureSection";
import EmailPlanDialog from "@/components/cart/email-plan-dialog";

const ProfessionalEmail = () => {
  const { 
    selectedTab, 
    setSelectedTab, 
    userCount, 
    period, 
    setPeriod,
    selectedPlan,
    showDialog,
    setShowDialog,
    handleUserCountChange,
    handlePurchase, 
    handleConfirmPurchase,
    emailPlans
  } = useEmailPlans();

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Email Profissional</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Soluções de email profissional empresarial com alto desempenho e segurança
        </p>
        
        <EmailPlanConfigurator 
          userCount={userCount}
          handleUserCountChange={handleUserCountChange}
          period={period}
          setPeriod={setPeriod}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        
        <EmailPlanGrid 
          emailPlans={emailPlans}
          selectedTab={selectedTab}
          userCount={userCount}
          period={period}
          handlePurchase={handlePurchase}
        />

        {selectedPlan && showDialog && (
          <EmailPlanDialog
            selectedPlan={selectedPlan}
            isOpen={showDialog}
            onClose={() => setShowDialog(false)}
            onConfirm={handleConfirmPurchase}
          />
        )}

        <EmailFeatureSection />
      </div>
    </Layout>
  );
};

export default ProfessionalEmail;
