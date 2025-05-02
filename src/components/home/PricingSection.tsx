
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PricingCard from "@/components/PricingCard";
import { formatPrice } from "@/utils/formatters";

interface PricingPlan {
  title: string;
  description: string;
  price: number | string;
  period: string;
  features: {
    text: string;
    included: boolean;
  }[];
  popular?: boolean;
}

const PricingSection = () => {
  const hostingPlans: PricingPlan[] = [
    {
      title: "Iniciante",
      description: "Ideal para sites pessoais e blogs",
      price: formatPrice(9900),
      period: "mês",
      features: [
        { text: "1 Site", included: true },
        { text: "10GB SSD", included: true },
        { text: "50GB Tráfego", included: true },
        { text: "5 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: false },
        { text: "CDN Cloudflare", included: false },
        { text: "Migração Gratuita", included: false },
      ],
    },
    {
      title: "Business",
      description: "Perfeito para pequenos negócios",
      price: formatPrice(15900),
      period: "mês",
      popular: true,
      features: [
        { text: "10 Sites", included: true },
        { text: "50GB SSD", included: true },
        { text: "200GB Tráfego", included: true },
        { text: "20 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN Cloudflare", included: true },
        { text: "Migração Gratuita", included: true },
      ],
    },
    {
      title: "Profissional",
      description: "Para médias e grandes empresas",
      price: formatPrice(28900),
      period: "mês",
      features: [
        { text: "Sites Ilimitados", included: true },
        { text: "100GB SSD", included: true },
        { text: "Tráfego Ilimitado", included: true },
        { text: "100 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN Cloudflare", included: true },
        { text: "Migração Gratuita", included: true },
      ],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-[#345990]">Planos de Hospedagem Web</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para o seu projeto com a melhor relação custo-benefício do mercado angolano.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {hostingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              {...plan}
            />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button asChild variant="link" className="text-[#345990]">
            <Link to="/products/cpanel">Ver todos os planos de hospedagem</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
