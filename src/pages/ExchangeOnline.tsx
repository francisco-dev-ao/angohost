
import React from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Mail, Globe, Server } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

const ExchangeOnline = () => {
  const plans = [
    {
      title: "Exchange Basic",
      description: "Exchange Online Plano 1",
      price: formatPrice(19900),
      period: "usuário/mês",
      features: [
        { text: "50GB de caixa postal", included: true },
        { text: "Outlook para desktop e web", included: true },
        { text: "Calendário compartilhado", included: true },
        { text: "Email em seu domínio", included: true },
        { text: "Teams básico", included: true },
        { text: "OneDrive 1TB", included: true },
      ],
    },
    {
      title: "Exchange Standard",
      description: "Exchange Online Plano 2",
      price: formatPrice(39900),
      period: "usuário/mês",
      popular: true,
      features: [
        { text: "100GB de caixa postal", included: true },
        { text: "Outlook completo", included: true },
        { text: "Calendário avançado", included: true },
        { text: "Email em seu domínio", included: true },
        { text: "Teams completo", included: true },
        { text: "OneDrive ilimitado", included: true },
      ],
    },
    {
      title: "Microsoft 365",
      description: "Solução completa",
      price: formatPrice(59900),
      period: "usuário/mês",
      features: [
        { text: "Exchange Online completo", included: true },
        { text: "Office 365 completo", included: true },
        { text: "SharePoint", included: true },
        { text: "Teams avançado", included: true },
        { text: "OneDrive ilimitado", included: true },
        { text: "Recursos avançados", included: true },
      ],
    },
  ];

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Exchange Online</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Soluções Microsoft Exchange Online para sua empresa
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Mail className="w-6 h-6" />}
            title="Exchange Online"
            description="Email profissional com a tecnologia Microsoft Exchange"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Microsoft 365"
            description="Integração completa com as ferramentas Microsoft 365"
          />
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Segurança Enterprise"
            description="Proteção avançada contra ameaças e conformidade"
          />
        </div>
      </div>
    </Layout>
  );
};

export default ExchangeOnline;
