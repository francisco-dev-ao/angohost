
import React from "react";
import Layout from "@/components/Layout";
import HeroSection from "@/components/home/HeroSection";
import DomainSearchSection from "@/components/home/DomainSearchSection";
import PartnerLogos from "@/components/home/PartnerLogos";
import PricingSection from "@/components/home/PricingSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import DomainSection from "@/components/home/DomainSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import EmailSection from "@/components/home/EmailSection";
import ClientLogosCarousel from "@/components/home/ClientLogosCarousel";
import CallToActionSection from "@/components/home/CallToActionSection";
import FaqSection from "@/components/home/FaqSection";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with Human Presence */}
      <HeroSection />

      {/* Domain Search moved below hero */}
      <DomainSearchSection />
      
      {/* Logos de Parceiros */}
      <PartnerLogos />

      {/* Pricing Section */}
      <PricingSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Domínios Section with Human Presence */}
      <DomainSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Email Profissional Section with Human Presence */}
      <EmailSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Client Logos Carousel Section - Only on homepage */}
      <ClientLogosCarousel />

      {/* Enhanced CTA Section */}
      <CallToActionSection />
    </Layout>
  );
};

export default Index;
