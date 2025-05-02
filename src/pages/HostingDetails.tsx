
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatters';
import { Cpu, Server, HardDrive, Clock, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import DomainValidator from '@/components/DomainValidator';

const HostingDetails = () => {
  const { planSlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPeriod = searchParams.get('period') || '1';
  const hostingType = searchParams.get('type') || 'shared';
  
  const [billingPeriod, setBillingPeriod] = useState(initialPeriod);
  const [domainOption, setDomainOption] = useState<'none' | 'new' | 'existing'>('none');
  const [domainName, setDomainName] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart } = useCart();
  
  // Dados de planos de hospedagem (em uma situação real, estes dados viriam de uma API)
  const hostingPlans = {
    'shared': {
      'básico': {
        title: "Básico",
        description: "Ideal para sites pessoais",
        basePrice: 9900,
        specs: {
          cpu: "1 vCPU Compartilhado",
          ram: "1GB RAM",
          storage: "10GB SSD",
          bandwidth: "Tráfego Ilimitado"
        },
        features: [
          { text: "1 Site", included: true },
          { text: "5 Contas de Email", included: true },
          { text: "Certificado SSL", included: true },
          { text: "Painel cPanel", included: true },
          { text: "Backup Semanal", included: true },
          { text: "Suporte 24/7", included: true },
        ],
      },
      'empresarial': {
        title: "Empresarial",
        description: "Para pequenos negócios",
        basePrice: 19900,
        popular: true,
        specs: {
          cpu: "2 vCPUs Compartilhados",
          ram: "2GB RAM",
          storage: "30GB SSD",
          bandwidth: "Tráfego Ilimitado"
        },
        features: [
          { text: "10 Sites", included: true },
          { text: "30 Contas de Email", included: true },
          { text: "Certificado SSL", included: true },
          { text: "Painel cPanel", included: true },
          { text: "Backup Diário", included: true },
          { text: "Suporte 24/7 Prioritário", included: true },
        ],
      },
      'profissional': {
        title: "Profissional",
        description: "Para médias empresas",
        basePrice: 29900,
        specs: {
          cpu: "4 vCPUs Compartilhados",
          ram: "4GB RAM",
          storage: "100GB SSD",
          bandwidth: "Tráfego Ilimitado"
        },
        features: [
          { text: "Sites Ilimitados", included: true },
          { text: "100 Contas de Email", included: true },
          { text: "Certificado SSL", included: true },
          { text: "Painel cPanel", included: true },
          { text: "Backup Diário", included: true },
          { text: "Suporte 24/7 Premium", included: true },
        ],
      }
    },
    'wordpress': {
      'wordpress-básico': {
        title: "WordPress Básico",
        description: "Para blogs simples",
        basePrice: 14900,
        specs: {
          cpu: "1 vCPU Otimizado",
          ram: "2GB RAM",
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
      'wordpress-pro': {
        title: "WordPress Pro",
        description: "Para sites corporativos",
        basePrice: 24900,
        popular: true,
        specs: {
          cpu: "2 vCPUs Otimizados",
          ram: "4GB RAM",
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
      'wordpress-agência': {
        title: "WordPress Agência",
        description: "Para agências e desenvolvedores",
        basePrice: 49900,
        specs: {
          cpu: "4 vCPUs Otimizados",
          ram: "8GB RAM",
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
    },
    'vps': {
      'vps-starter': {
        title: "VPS Starter",
        description: "Servidor virtual básico",
        basePrice: 39900,
        specs: {
          cpu: "2 vCPUs Dedicados",
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
      'vps-business': {
        title: "VPS Business",
        description: "Para aplicações de médio porte",
        basePrice: 59900,
        popular: true,
        specs: {
          cpu: "4 vCPUs Dedicados",
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
      'vps-enterprise': {
        title: "VPS Enterprise",
        description: "Para aplicações exigentes",
        basePrice: 99900,
        specs: {
          cpu: "8 vCPUs Dedicados",
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
    }
  };
  
  // Normaliza o slug do plano para buscar no objeto de planos
  const normalizedPlanSlug = planSlug?.toLowerCase();
  
  // Busca o plano com base no tipo e slug
  const findPlan = () => {
    if (!normalizedPlanSlug || !hostingType) return null;
    
    const plansOfType = hostingPlans[hostingType as keyof typeof hostingPlans];
    if (!plansOfType) return null;
    
    // Tenta encontrar o plano pelo slug exato
    if (plansOfType[normalizedPlanSlug as keyof typeof plansOfType]) {
      return plansOfType[normalizedPlanSlug as keyof typeof plansOfType];
    }
    
    // Se não encontrar, tenta encontrar pelo título normalizado
    const planKey = Object.keys(plansOfType).find(key => {
      const plan = plansOfType[key as keyof typeof plansOfType];
      return plan.title.toLowerCase().replace(/\s+/g, '-') === normalizedPlanSlug;
    });
    
    return planKey ? plansOfType[planKey as keyof typeof plansOfType] : null;
  };
  
  const plan = findPlan();
  
  if (!plan) {
    return (
      <Layout>
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Plano não encontrado</h1>
          <p>O plano de hospedagem que você está procurando não existe.</p>
          <Button className="mt-4" onClick={() => navigate('/hosting')}>
            Ver todos os planos
          </Button>
        </div>
      </Layout>
    );
  }
  
  const calculateYearlyPrice = (basePrice: number, years: number) => {
    // Aplicar desconto para planos plurianuais (5% por ano adicional)
    let discount = 0;
    if (years > 1) {
      discount = (years - 1) * 0.05;
    }
    return Math.round(basePrice * years * (1 - discount));
  };
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    
    try {
      const years = parseInt(billingPeriod);
      const totalPrice = calculateYearlyPrice(plan.basePrice, years);
      
      // Adicionar plano ao carrinho
      addToCart({
        id: uuidv4(),
        title: plan.title,
        quantity: 1,
        price: totalPrice,
        basePrice: plan.basePrice,
        type: hostingType,
        description: `${plan.title} - ${billingPeriod} ${parseInt(billingPeriod) === 1 ? 'ano' : 'anos'}`,
        years
      });
      
      // Se estiver registrando um domínio, adiciona ao carrinho
      if (domainOption === 'new' && domainName) {
        addToCart({
          id: uuidv4(),
          title: `Domínio ${domainName}`,
          quantity: 1,
          price: 5000,
          basePrice: 5000,
          type: "domain",
          domain: domainName,
          description: `Registro de domínio por ${years} ${years === 1 ? 'ano' : 'anos'}`,
          years
        });
      }
      
      toast.success(`${plan.title} adicionado ao carrinho!`);
      navigate('/cart');
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      toast.error('Ocorreu um erro ao adicionar ao carrinho');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleDomainSelected = (domain: string) => {
    setDomainName(domain);
    setDomainOption('new');
  };
  
  return (
    <Layout>
      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Detalhes do plano */}
          <div className="lg:w-2/3">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" onClick={() => navigate('/hosting')} className="p-0 h-auto">
                ← Voltar
              </Button>
              {plan.popular && <Badge>Mais Popular</Badge>}
            </div>
            
            <h1 className="text-4xl font-bold mb-2">{plan.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{plan.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Especificações Técnicas</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-primary" />
                      <span className="text-lg">{plan.specs.cpu}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Server className="h-5 w-5 text-primary" />
                      <span className="text-lg">{plan.specs.ram}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-5 w-5 text-primary" />
                      <span className="text-lg">{plan.specs.storage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="text-lg">{plan.specs.bandwidth}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Recursos Inclusos</h2>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className={`h-5 w-5 ${feature.included ? 'text-green-500' : 'text-gray-400'}`} />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Domínio para seu Plano</h2>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Button 
                  variant={domainOption === 'none' ? 'default' : 'outline'} 
                  onClick={() => setDomainOption('none')}
                  className="flex-1 justify-start"
                >
                  <span className="flex items-center">
                    <span className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${domainOption === 'none' ? 'bg-primary border-transparent' : 'border-gray-300'}`}>
                      {domainOption === 'none' && (
                        <span className="h-2 w-2 rounded-full bg-white"></span>
                      )}
                    </span>
                    Não preciso de domínio
                  </span>
                </Button>
                
                <Button 
                  variant={domainOption === 'new' ? 'default' : 'outline'} 
                  onClick={() => setDomainOption('new')}
                  className="flex-1 justify-start"
                >
                  <span className="flex items-center">
                    <span className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${domainOption === 'new' ? 'bg-primary border-transparent' : 'border-gray-300'}`}>
                      {domainOption === 'new' && (
                        <span className="h-2 w-2 rounded-full bg-white"></span>
                      )}
                    </span>
                    Registrar um novo domínio
                  </span>
                </Button>
                
                <Button 
                  variant={domainOption === 'existing' ? 'default' : 'outline'} 
                  onClick={() => setDomainOption('existing')}
                  className="flex-1 justify-start"
                >
                  <span className="flex items-center">
                    <span className={`mr-2 flex h-5 w-5 items-center justify-center rounded-full border ${domainOption === 'existing' ? 'bg-primary border-transparent' : 'border-gray-300'}`}>
                      {domainOption === 'existing' && (
                        <span className="h-2 w-2 rounded-full bg-white"></span>
                      )}
                    </span>
                    Usar domínio existente
                  </span>
                </Button>
              </div>
              
              {domainOption === 'new' && (
                <div className="border p-4 rounded-md">
                  <DomainValidator onDomainValidated={handleDomainSelected} />
                </div>
              )}
              
              {domainOption === 'existing' && (
                <div className="border p-4 rounded-md">
                  <p className="mb-4">
                    Para usar um domínio existente, finalize a compra da hospedagem e depois entre em contato
                    com nosso suporte técnico para configurar seu domínio.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Resumo do pedido */}
          <div className="lg:w-1/3">
            <Card className="sticky top-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground">Período de faturamento</p>
                    <Tabs 
                      defaultValue={billingPeriod} 
                      value={billingPeriod}
                      onValueChange={setBillingPeriod}
                      className="mt-2"
                    >
                      <TabsList className="grid grid-cols-4 w-full">
                        <TabsTrigger value="1">1 ano</TabsTrigger>
                        <TabsTrigger value="2">2 anos</TabsTrigger>
                        <TabsTrigger value="3">3 anos</TabsTrigger>
                        <TabsTrigger value="4">4 anos</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span>Plano {plan.title}</span>
                      <span>{formatPrice(calculateYearlyPrice(plan.basePrice, parseInt(billingPeriod)))}</span>
                    </div>
                    
                    {domainOption === 'new' && domainName && (
                      <div className="flex justify-between mb-2">
                        <span>Domínio {domainName}</span>
                        <span>{formatPrice(5000)}</span>
                      </div>
                    )}
                    
                    {parseInt(billingPeriod) > 1 && (
                      <div className="flex justify-between text-green-600 mb-2">
                        <span>Desconto multi-ano ({(parseInt(billingPeriod) - 1) * 5}%)</span>
                        <span>-{formatPrice(plan.basePrice * parseInt(billingPeriod) - calculateYearlyPrice(plan.basePrice, parseInt(billingPeriod)))}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-lg border-t mt-4 pt-4">
                      <span>Total</span>
                      <span>{formatPrice(calculateYearlyPrice(plan.basePrice, parseInt(billingPeriod)) + (domainOption === 'new' && domainName ? 5000 : 0))}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full text-lg py-6" 
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HostingDetails;
