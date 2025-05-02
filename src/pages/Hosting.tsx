
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/utils/formatters';
import { Server, Globe, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hosting = () => {
  const navigate = useNavigate();
  const [hostingType, setHostingType] = useState('shared');
  const [billingPeriod, setBillingPeriod] = useState('1');
  
  // Dados de planos de hospedagem
  const sharedHostingPlans = [
    {
      title: "Básico",
      description: "Ideal para sites pessoais",
      price: 9900,
      features: [
        "1 Site",
        "10GB SSD",
        "Tráfego Ilimitado",
        "5 Contas de Email",
        "Certificado SSL",
        "Painel cPanel",
      ],
    },
    {
      title: "Empresarial",
      description: "Para pequenos negócios",
      price: 19900,
      popular: true,
      features: [
        "10 Sites",
        "30GB SSD",
        "Tráfego Ilimitado",
        "30 Contas de Email",
        "Certificado SSL",
        "Painel cPanel",
      ],
    },
    {
      title: "Profissional",
      description: "Para médias empresas",
      price: 29900,
      features: [
        "Sites Ilimitados",
        "100GB SSD",
        "Tráfego Ilimitado",
        "100 Contas de Email",
        "Certificado SSL",
        "Painel cPanel",
      ],
    },
  ];
  
  const wordpressHostingPlans = [
    {
      title: "WordPress Básico",
      description: "Para blogs simples",
      price: 14900,
      features: [
        "1 Site WordPress",
        "20GB SSD",
        "WordPress Otimizado",
        "Proteção contra Malware",
        "Certificado SSL",
        "Backup Diário",
      ],
    },
    {
      title: "WordPress Pro",
      description: "Para sites corporativos",
      price: 24900,
      popular: true,
      features: [
        "5 Sites WordPress",
        "50GB SSD",
        "WordPress & WooCommerce Otimizados",
        "Proteção contra Malware",
        "Certificado SSL",
        "CDN Integrado",
      ],
    },
    {
      title: "WordPress Agência",
      description: "Para agências e desenvolvedores",
      price: 49900,
      features: [
        "Sites WordPress Ilimitados",
        "100GB SSD",
        "Ambiente Staging",
        "Git Integrado",
        "Certificado SSL Wildcard",
        "Backup em Tempo Real",
      ],
    },
  ];
  
  const vpsHostingPlans = [
    {
      title: "VPS Starter",
      description: "Servidor virtual básico",
      price: 39900,
      features: [
        "2 vCPUs",
        "4GB RAM",
        "50GB SSD NVMe",
        "1TB Tráfego",
        "1 IP Dedicado",
        "Acesso Root",
      ],
    },
    {
      title: "VPS Business",
      description: "Para aplicações de médio porte",
      price: 59900,
      popular: true,
      features: [
        "4 vCPUs",
        "8GB RAM",
        "100GB SSD NVMe",
        "2TB Tráfego",
        "1 IP Dedicado",
        "Painel de Controle",
      ],
    },
    {
      title: "VPS Enterprise",
      description: "Para aplicações exigentes",
      price: 99900,
      features: [
        "8 vCPUs",
        "16GB RAM",
        "200GB SSD NVMe",
        "5TB Tráfego",
        "2 IPs Dedicados",
        "Suporte 24/7 Prioritário",
      ],
    },
  ];
  
  // Função para retornar os planos de acordo com o tipo selecionado
  const getHostingPlans = () => {
    switch (hostingType) {
      case 'shared':
        return sharedHostingPlans;
      case 'wordpress':
        return wordpressHostingPlans;
      case 'vps':
        return vpsHostingPlans;
      default:
        return sharedHostingPlans;
    }
  };
  
  // Calcular preço com descontos para períodos maiores
  const calculatePrice = (basePrice: number, period: number) => {
    let discount = 0;
    
    // Aplicar desconto para planos plurianuais (5% por ano adicional)
    if (period > 1) {
      discount = (period - 1) * 0.05;
    }
    
    return Math.round(basePrice * period * (1 - discount));
  };
  
  const handleViewDetails = (planTitle: string) => {
    // Mapear para o formato de URL
    const planSlug = planTitle.toLowerCase().replace(/\s+/g, '-');
    navigate(`/hosting/${planSlug}?period=${billingPeriod}&type=${hostingType}`);
  };

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Hospedagem de Sites</h1>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Escolha o plano ideal para seu projeto com a melhor relação custo-benefício
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-8 mb-12">
          <Tabs 
            defaultValue="shared" 
            value={hostingType}
            onValueChange={setHostingType}
            className="w-full max-w-md"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="shared">
                <Globe className="mr-2 h-4 w-4" />
                Compartilhada
              </TabsTrigger>
              <TabsTrigger value="wordpress">
                <Package className="mr-2 h-4 w-4" />
                WordPress
              </TabsTrigger>
              <TabsTrigger value="vps">
                <Server className="mr-2 h-4 w-4" />
                VPS
              </TabsTrigger>
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
          {getHostingPlans().map((plan, index) => (
            <Card key={index} className={`flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                {plan.popular && <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-full mb-2">Mais Popular</span>}
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-3xl font-bold">{formatPrice(calculatePrice(plan.price, parseInt(billingPeriod)))}</span>
                  <span className="text-muted-foreground">/{billingPeriod} {parseInt(billingPeriod) === 1 ? 'ano' : 'anos'}</span>
                  
                  {parseInt(billingPeriod) > 1 && (
                    <div className="text-xs text-green-600 mt-1">
                      Economia de {(parseInt(billingPeriod) - 1) * 5}%
                    </div>
                  )}
                </div>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleViewDetails(plan.title)}
                >
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Seção de recursos incluídos */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Todos os planos incluem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos os melhores recursos para garantir o melhor desempenho e segurança para o seu site.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              "99.9% de uptime garantido",
              "Painel de controle intuitivo",
              "Certificado SSL grátis",
              "Suporte técnico 24/7",
              "Backup automático",
              "MySQL otimizado",
              "PHP atualizado",
              "Instalador de aplicativos",
              "Proteção contra DDoS",
              "Migração gratuita",
              "Firewall avançado",
              "Domínio grátis*"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            * Domínio grátis no primeiro ano para planos de 12 meses ou mais
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Hosting;
