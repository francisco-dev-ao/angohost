
import React from "react";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import PricingTabsSection from "@/components/home/PricingTabsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import SupportSection from "@/components/home/SupportSection";
import CtaSection from "@/components/home/CtaSection";
import DomainSearchSection from "@/components/home/DomainSearchSection";
import Layout from "@/components/Layout";
import TrustpilotSection from "@/components/home/TrustpilotSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <DomainSearchSection />
      <PricingTabsSection />
      <TrustpilotSection />
      <ServicesSection />
      <TestimonialsSection />
      <SupportSection />
      <CtaSection />
    </Layout>
  );
};

export default Index;
