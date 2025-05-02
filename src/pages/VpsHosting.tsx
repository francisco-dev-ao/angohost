
import React from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Server, HardDrive, Globe } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

const VpsHosting = () => {
  const plans = [
    {
      title: "VPS Start",
      description: "Ideal para começar",
      price: formatPrice(49990),
      period: "mês",
      features: [
        { text: "2 vCPUs", included: true },
        { text: "4GB RAM", included: true },
        { text: "50GB SSD NVMe", included: true },
        { text: "1TB Tráfego", included: true },
        { text: "1 IP Dedicado", included: true },
        { text: "Proteção DDoS", included: true },
      ],
    },
    {
      title: "VPS Pro",
      description: "Para aplicações profissionais",
      price: formatPrice(99990),
      period: "mês",
      popular: true,
      features: [
        { text: "4 vCPUs", included: true },
        { text: "8GB RAM", included: true },
        { text: "100GB SSD NVMe", included: true },
        { text: "2TB Tráfego", included: true },
        { text: "1 IP Dedicado", included: true },
        { text: "Proteção DDoS", included: true },
      ],
    },
    {
      title: "VPS Enterprise",
      description: "Máximo desempenho",
      price: formatPrice(199990),
      period: "mês",
      features: [
        { text: "8 vCPUs", included: true },
        { text: "16GB RAM", included: true },
        { text: "200GB SSD NVMe", included: true },
        { text: "5TB Tráfego", included: true },
        { text: "2 IPs Dedicados", included: true },
        { text: "Proteção DDoS", included: true },
      ],
    },
  ];

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Servidores VPS</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          VPS de alta performance com recursos dedicados
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Recursos Dedicados"
            description="CPU, RAM e SSD exclusivos para seu servidor"
          />
          <FeatureCard
            icon={<HardDrive className="w-6 h-6" />}
            title="SSD NVMe"
            description="Armazenamento em discos SSD NVMe para máxima velocidade"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Rede de Alta Velocidade"
            description="Conexão de 1Gbps com proteção DDoS incluída"
          />
        </div>
      </div>
    </Layout>
  );
};

export default VpsHosting;
