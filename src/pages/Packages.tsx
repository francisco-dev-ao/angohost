
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils/formatters";
import { Package, Cpu, Server, HardDrive, Clock } from "lucide-react";

// Define the package types
interface PackageFeature {
  text: string;
  included: boolean;
}

interface PackageType {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  popular?: boolean;
  features: PackageFeature[];
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    bandwidth: string;
  };
}

const Packages = () => {
  const navigate = useNavigate();
  const [packageType, setPackageType] = useState("standard");
  const [billingPeriod, setBillingPeriod] = useState("1");
  
  // Define the packages for each type
  const standardPackages: PackageType[] = [
    {
      id: "standard-basic",
      title: "Básico",
      description: "Para sites pessoais e blogs",
      basePrice: 9900,
      specs: {
        cpu: "1 vCPU",
        ram: "2GB RAM",
        storage: "10GB SSD",
        bandwidth: "Tráfego Ilimitado"
      },
      features: [
        { text: "1 Site", included: true },
        { text: "5 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Painel de Controle", included: true },
        { text: "Backup Semanal", included: true },
        { text: "Suporte 24/7", included: true },
      ],
    },
    {
      id: "standard-business",
      title: "Empresarial",
      description: "Ideal para pequenos negócios",
      basePrice: 15900,
      popular: true,
      specs: {
        cpu: "2 vCPUs",
        ram: "4GB RAM",
        storage: "30GB SSD",
        bandwidth: "Tráfego Ilimitado"
      },
      features: [
        { text: "10 Sites", included: true },
        { text: "30 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Painel de Controle", included: true },
        { text: "Backup Diário", included: true },
        { text: "Suporte 24/7 Prioritário", included: true },
      ],
    },
    {
      id: "standard-pro",
      title: "Profissional",
      description: "Para médias e grandes empresas",
      basePrice: 28900,
      specs: {
        cpu: "4 vCPUs",
        ram: "8GB RAM",
        storage: "100GB SSD",
        bandwidth: "Tráfego Ilimitado"
      },
      features: [
        { text: "Sites Ilimitados", included: true },
        { text: "100 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Painel de Controle", included: true },
        { text: "Backup Diário", included: true },
        { text: "Suporte 24/7 Premium", included: true },
      ],
    }
  ];
  
  const wordpressPackages: PackageType[] = [
    {
      id: "wordpress-basic",
      title: "WordPress Básico",
      description: "Para blogs e sites simples",
      basePrice: 19900,
      specs: {
        cpu: "1 vCPU",
        ram: "4GB RAM",
        storage: "20GB SSD",
        bandwidth: "Tráfego Ilimitado"
      },
      features: [
        { text: "1 Site WordPress", included: true },
        { text: "WordPress Otimizado", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: true },
        { text: "Cache Avançado", included: true },
        { text: "Suporte WordPress", included: true },
      ],
    },
    {
      id: "wordpress-pro",
      title: "WordPress Pro",
      description: "Para empresas e lojas online",
      basePrice: 39900,
      popular: true,
      specs: {
        cpu: "2 vCPUs",
        ram: "8GB RAM",
        storage: "50GB SSD",
        bandwidth: "Tráfego Ilimitado"
      },
      features: [
        { text: "5 Sites WordPress", included: true },
        { text: "WordPress Otimizado", included: true },
        { text: "WooCommerce Otimizado", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Backup Diário", included: true },
        { text: "CDN Integrado", included: true },
      ],
    },
    {
      id: "wordpress-agency",
      title: "WordPress Agência",
      description: "Para agências e desenvolvedores",
      basePrice: 79900,
      specs: {
        cpu: "4 vCPUs",
        ram: "16GB RAM",
        storage: "100GB SSD",
        bandwidth: "Tráfego Ilimitado"
      },
      features: [
        { text: "Sites WordPress Ilimitados", included: true },
        { text: "Ambiente Staging", included: true },
        { text: "Git Integrado", included: true },
        { text: "Certificado SSL Wildcard", included: true },
        { text: "Backup Diário", included: true },
        { text: "Suporte Prioritário", included: true },
      ],
    }
  ];
  
  const vpsPackages: PackageType[] = [
    {
      id: "vps-start",
      title: "VPS Start",
      description: "Servidor virtual básico",
      basePrice: 49900,
      specs: {
        cpu: "2 vCPUs",
        ram: "4GB RAM",
        storage: "50GB SSD NVMe",
        bandwidth: "1TB Tráfego"
      },
      features: [
        { text: "Acesso Root", included: true },
        { text: "1 IP Dedicado", included: true },
        { text: "Proteção DDoS", included: true },
        { text: "Painel de Controle", included: true },
        { text: "Backup Semanal", included: true },
        { text: "Suporte 24/7", included: true },
      ],
    },
    {
      id: "vps-pro",
      title: "VPS Pro",
      description: "Para aplicações profissionais",
      basePrice: 99900,
      popular: true,
      specs: {
        cpu: "4 vCPUs",
        ram: "8GB RAM",
        storage: "100GB SSD NVMe",
        bandwidth: "2TB Tráfego"
      },
      features: [
        { text: "Acesso Root", included: true },
        { text: "1 IP Dedicado", included: true },
        { text: "Proteção DDoS", included: true },
        { text: "Painel de Controle", included: true },
        { text: "Backup Diário", included: true },
        { text: "Suporte 24/7 Prioritário", included: true },
      ],
    },
    {
      id: "vps-enterprise",
      title: "VPS Enterprise",
      description: "Máximo desempenho",
      basePrice: 199900,
      specs: {
        cpu: "8 vCPUs",
        ram: "16GB RAM",
        storage: "200GB SSD NVMe",
        bandwidth: "5TB Tráfego"
      },
      features: [
        { text: "Acesso Root", included: true },
        { text: "2 IPs Dedicados", included: true },
        { text: "Proteção DDoS Avançada", included: true },
        { text: "Painel de Controle", included: true },
        { text: "Backup Diário", included: true },
        { text: "Suporte 24/7 VIP", included: true },
      ],
    }
  ];

  // Helper function to get packages based on selected type
  const getPackages = () => {
    switch (packageType) {
      case "standard":
        return standardPackages;
      case "wordpress":
        return wordpressPackages;
      case "vps":
        return vpsPackages;
      default:
        return standardPackages;
    }
  };

  // Calculate price with period discounts
  const calculateYearlyPrice = (basePrice: number, years: number) => {
    // Apply discount for multi-year plans (5% per additional year)
    let discount = 0;
    if (years > 1) {
      discount = (years - 1) * 0.05;
    }
    return Math.round(basePrice * years * (1 - discount));
  };

  const handleViewDetails = (packageId: string) => {
    navigate(`/packages/${packageId}?period=${billingPeriod}`);
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Pacotes de Hospedagem</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Escolha o pacote ideal para o seu projeto com a melhor relação custo-benefício do mercado
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8 mb-12">
          <Tabs 
            defaultValue="standard" 
            value={packageType}
            onValueChange={setPackageType}
            className="w-full max-w-md"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="standard">Standard</TabsTrigger>
              <TabsTrigger value="wordpress">WordPress</TabsTrigger>
              <TabsTrigger value="vps">VPS</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs 
            defaultValue="1" 
            value={billingPeriod}
            onValueChange={setBillingPeriod}
            className="w-full max-w-md"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="1">1 ano</TabsTrigger>
              <TabsTrigger value="2">2 anos</TabsTrigger>
              <TabsTrigger value="3">3 anos</TabsTrigger>
              <TabsTrigger value="4">4 anos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {getPackages().map((pkg) => (
            <Card key={pkg.id} className={`flex flex-col ${pkg.popular ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                {pkg.popular && <Badge className="self-start mb-2">Mais Popular</Badge>}
                <CardTitle>{pkg.title}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="mb-6">
                  <span className="text-3xl font-bold">{formatPrice(calculateYearlyPrice(pkg.basePrice, parseInt(billingPeriod)))}</span>
                  <span className="text-muted-foreground">/{billingPeriod} {parseInt(billingPeriod) === 1 ? 'ano' : 'anos'}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span>{pkg.specs.cpu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span>{pkg.specs.ram}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-primary" />
                    <span>{pkg.specs.storage}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{pkg.specs.bandwidth}</span>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className={`flex items-center ${feature.included ? '' : 'text-muted-foreground line-through'}`}>
                      {feature.included ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleViewDetails(pkg.id)}>
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Packages;
