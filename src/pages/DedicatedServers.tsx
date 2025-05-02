
import React from "react";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import FeatureCard from "@/components/FeatureCard";
import { Server, HardDrive, Globe } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

const DedicatedServers = () => {
  const plans = [
    {
      title: "Dedicado Start",
      description: "Servidor básico dedicado",
      price: formatPrice(299990),
      period: "mês",
      features: [
        { text: "Intel Xeon E-2236", included: true },
        { text: "32GB RAM", included: true },
        { text: "2x 512GB SSD", included: true },
        { text: "10TB Tráfego", included: true },
        { text: "5 IPs Dedicados", included: true },
        { text: "Proteção DDoS", included: true },
      ],
    },
    {
      title: "Dedicado Pro",
      description: "Alto desempenho",
      price: formatPrice(499990),
      period: "mês",
      popular: true,
      features: [
        { text: "2x Intel Xeon Silver", included: true },
        { text: "64GB RAM", included: true },
        { text: "2x 1TB SSD", included: true },
        { text: "20TB Tráfego", included: true },
        { text: "10 IPs Dedicados", included: true },
        { text: "Proteção DDoS", included: true },
      ],
    },
    {
      title: "Dedicado Enterprise",
      description: "Máxima performance",
      price: formatPrice(899990),
      period: "mês",
      features: [
        { text: "2x Intel Xeon Gold", included: true },
        { text: "128GB RAM", included: true },
        { text: "4x 1TB SSD", included: true },
        { text: "50TB Tráfego", included: true },
        { text: "20 IPs Dedicados", included: true },
        { text: "Proteção DDoS", included: true },
      ],
    },
  ];

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Servidores Dedicados</h1>
        <p className="text-lg text-center text-muted-foreground mb-12">
          Servidores físicos dedicados de alta performance
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Server className="w-6 h-6" />}
            title="Hardware Dedicado"
            description="Servidor físico exclusivo para sua empresa"
          />
          <FeatureCard
            icon={<HardDrive className="w-6 h-6" />}
            title="Configuração Flexível"
            description="Personalize seu servidor conforme sua necessidade"
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6" />}
            title="Rede Enterprise"
            description="Conexão redundante de 10Gbps com proteção DDoS"
          />
        </div>
      </div>
    </Layout>
  );
};

export default DedicatedServers;
