
import React, { useState } from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Server, Database, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, parsePrice } from "@/utils/formatters";

const WordPressHosting = () => {
  const [billingYears, setBillingYears] = useState("1");
  
  const plans = [
    {
      title: "WordPress Basic",
      description: "Ideal para blogs e sites pessoais",
      price: formatPrice(19900),
      period: "mês",
      features: [
        { text: "1 Site WordPress", included: true },
        { text: "10GB SSD", included: true },
        { text: "50GB Tráfego", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN", included: false },
      ],
    },
    {
      title: "WordPress Pro",
      description: "Perfeito para empresas",
      price: formatPrice(39900),
      period: "mês",
      popular: true,
      features: [
        { text: "5 Sites WordPress", included: true },
        { text: "30GB SSD", included: true },
        { text: "100GB Tráfego", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN", included: true },
      ],
    },
    {
      title: "WordPress Business",
      description: "Para grandes projetos",
      price: formatPrice(79900),
      period: "mês",
      features: [
        { text: "10 Sites WordPress", included: true },
        { text: "100GB SSD", included: true },
        { text: "500GB Tráfego", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN", included: true },
      ],
    },
  ];

  const yearlyPlans = plans.map(plan => ({
    ...plan,
    price: formatPrice(Number(parsePrice(plan.price.toString())) * parseInt(billingYears)),
    period: `${billingYears} ${parseInt(billingYears) === 1 ? 'ano' : 'anos'}`
  }));

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Hospedagem WordPress</h1>
        <p className="text-lg text-center text-muted-foreground mb-8">
          Hospedagem otimizada para WordPress com instalação em 1 clique
        </p>
        
        <div className="max-w-xs mx-auto mb-8">
          <Select value={billingYears} onValueChange={setBillingYears}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ano</SelectItem>
              <SelectItem value="2">2 anos</SelectItem>
              <SelectItem value="3">3 anos</SelectItem>
              <SelectItem value="4">4 anos</SelectItem>
              <SelectItem value="5">5 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {yearlyPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Performance Otimizada"
            description="Servidores otimizados especificamente para WordPress com cache LiteSpeed"
          />
          <FeatureCard
            icon={<Database className="w-6 h-6" />}
            title="Backup Diário"
            description="Seus dados sempre seguros com backup diário automático"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="SSL Grátis"
            description="Certificado SSL grátis para todos os seus sites"
          />
        </div>
      </div>
    </Layout>
  );
};

export default WordPressHosting;
