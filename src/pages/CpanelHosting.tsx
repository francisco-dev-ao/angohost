import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ListBullet, CheckCircle, ShieldCheck, PiggyBank, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatters';
import AdditionalProducts from '@/components/AdditionalProducts';
import { useDomainAvailability } from '@/hooks/useDomainAvailability';

const cpanelPlans = [
  {
    id: 'cpanel-basic',
    title: 'cPanel Básico',
    description: 'Ideal para começar, com recursos essenciais para seu site.',
    price: 9900,
    storage: '10 GB',
    bandwidth: 'Ilimitada',
    databases: '5',
    emails: '10',
    features: ['cPanel', 'Certificado SSL', 'Suporte 24/7']
  },
  {
    id: 'cpanel-premium',
    title: 'cPanel Premium',
    description: 'Mais recursos e desempenho para sites em crescimento.',
    price: 19900,
    storage: '50 GB',
    bandwidth: 'Ilimitada',
    databases: 'Ilimitadas',
    emails: '50',
    features: ['cPanel', 'Certificado SSL', 'Suporte 24/7', 'Backup Automático']
  },
  {
    id: 'cpanel-business',
    title: 'cPanel Business',
    description: 'A solução completa para empresas, com alta capacidade e recursos avançados.',
    price: 39900,
    storage: '100 GB',
    bandwidth: 'Ilimitada',
    databases: 'Ilimitadas',
    emails: 'Ilimitadas',
    features: ['cPanel', 'Certificado SSL', 'Suporte 24/7', 'Backup Automático', 'CDN']
  }
];

const additionalProducts = [
  {
    id: 'seo-boost',
    title: 'SEO Boost',
    description: 'Aumente o tráfego do seu site com otimização SEO profissional.',
    basePrice: 49900
  },
  {
    id: 'security-pack',
    title: 'Pacote de Segurança Avançada',
    description: 'Proteja seu site contra ameaças com nosso pacote de segurança.',
    basePrice: 29900
  }
];

const CpanelHosting = () => {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [currentDomain, setCurrentDomain] = useState('');
  const [ownDomainChecked, setOwnDomainChecked] = useState(false);
	const [domainYears, setDomainYears] = useState<number | null>(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { checkAvailability, availability, loading } = useDomainAvailability();
  const [domainPrice, setDomainPrice] = useState(2000);

  useEffect(() => {
    if (availability && availability.available === false) {
      setDomainPrice(2000);
    }
  }, [availability]);

  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
  };

  const handleDomainSearch = async () => {
    if (currentDomain) {
      await checkAvailability(currentDomain);
    }
  };

  const handleOwnDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOwnDomainChecked(e.target.checked);
  };

	const handleDomainYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDomainYears(parseInt(e.target.value));
  };

  const handleAddToCart = (plan: any, domainName: string = '') => {
    const years = domainYears || 1;
    
    addToCart({
      id: `hosting-${plan.title}-${Date.now()}`,
      name: `${plan.title} Hosting`,
      title: plan.title,
      price: plan.price * years,
      basePrice: plan.price,
      quantity: 1,
      type: 'service',
      years,
      domain: domainName
    });
    
    toast.success(`Plano ${plan.title} adicionado ao carrinho!`);
    setSelectedPlan(null);
  };

  const handleAddPlanWithDomain = (plan: any) => {
    const years = domainYears || 1;
    
    // Add the hosting plan
    addToCart({
      id: `hosting-${plan.title}-${Date.now()}`,
      name: `${plan.title} Hosting`,
      title: plan.title,
      price: plan.price * years,
      basePrice: plan.basePrice || plan.price,
      quantity: 1,
      type: 'service',
      years,
      description: plan.description,
      domain: currentDomain
    });
    
    // Add the domain
    if (currentDomain && !ownDomainChecked) {
      addToCart({
        id: `domain-${currentDomain}-${Date.now()}`,
        name: `Domínio: ${currentDomain}`,
        title: `Domínio: ${currentDomain}`,
        quantity: 1,
        price: domainPrice,
        basePrice: domainPrice,
        type: 'domain',
        domain: currentDomain
      });
    }
    
    toast.success(`Plano ${plan.title} com domínio adicionado ao carrinho!`);
    navigate('/cart');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">cPanel Hosting</h1>
      <p className="text-muted-foreground mb-4">
        Escolha o plano cPanel perfeito para o seu site. Todos os nossos planos incluem recursos essenciais para você começar.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cpanelPlans.map((plan) => (
          <Card key={plan.id} className={`p-6 flex flex-col justify-between ${selectedPlan?.id === plan.id ? 'border-2 border-primary' : ''}`}>
            <div>
              <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
              <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
              <ul className="list-none pl-0 mb-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">{formatPrice(plan.price)} / mês</div>
              <Button onClick={() => handlePlanClick(plan)} className="w-full">
                Selecionar Plano
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedPlan && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Adicionar Domínio</CardTitle>
            <CardDescription>
              Escolha um domínio para usar com seu plano de hospedagem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="exemplo.ao"
                value={currentDomain}
                onChange={(e) => setCurrentDomain(e.target.value)}
              />
              <Button onClick={handleDomainSearch} disabled={loading}>
                {loading ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
            {availability && (
              <>
                {availability.available ? (
                  <div className="text-green-500 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>{currentDomain} está disponível!</span>
                  </div>
                ) : (
                  <div className="text-red-500 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{currentDomain} não está disponível.</span>
                  </div>
                )}
              </>
            )}
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="1"
                defaultValue={1}
                onChange={handleDomainYearsChange}
              />
              <Label>Anos</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="checkbox"
                id="own-domain"
                checked={ownDomainChecked}
                onChange={handleOwnDomainChange}
              />
              <Label htmlFor="own-domain">Já possuo este domínio</Label>
            </div>
          </CardContent>
          <div className="p-6 border-t flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setSelectedPlan(null)}>
              Cancelar
            </Button>
            <Button onClick={() => handleAddToCart(selectedPlan, ownDomainChecked ? currentDomain : '')}>
              Adicionar Plano
            </Button>
            {!ownDomainChecked && (
              <Button onClick={() => handleAddPlanWithDomain(selectedPlan)}>
                Adicionar Plano + Domínio
              </Button>
            )}
          </div>
        </Card>
      )}

      <AdditionalProducts products={additionalProducts} />
    </div>
  );
};

export default CpanelHosting;
