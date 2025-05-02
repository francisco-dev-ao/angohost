
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import PricingCard from "@/components/PricingCard";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatPrice } from "@/utils/formatters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import DomainValidator from "@/components/DomainValidator";

const CpanelHosting = () => {
  const [billingYears, setBillingYears] = useState("1");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState("register");
  const [domainName, setDomainName] = useState("");
  const [isDomainValid, setIsDomainValid] = useState(false);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // New pricing structure based on angohost.ao
  const hostingPlans = [
    {
      title: "Iniciante",
      description: "Ideal para sites pessoais e blogs",
      basePrice: 9900,
      features: [
        { text: "1 Site", included: true },
        { text: "10GB SSD", included: true },
        { text: "Tráfego Ilimitado", included: true },
        { text: "5 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Painel cPanel", included: true },
        { text: "Backup Semanal", included: true },
        { text: "Suporte 24/7", included: true },
      ],
    },
    {
      title: "Empresarial",
      description: "Perfeito para pequenos negócios",
      basePrice: 15900,
      period: "mês",
      popular: true,
      features: [
        { text: "10 Sites", included: true },
        { text: "30GB SSD", included: true },
        { text: "Tráfego Ilimitado", included: true },
        { text: "30 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Painel cPanel", included: true },
        { text: "Backup Diário", included: true },
        { text: "Suporte 24/7", included: true },
      ],
    },
    {
      title: "Profissional",
      description: "Para médias e grandes empresas",
      basePrice: 28900,
      period: "mês",
      features: [
        { text: "Sites Ilimitados", included: true },
        { text: "100GB SSD", included: true },
        { text: "Tráfego Ilimitado", included: true },
        { text: "100 Contas de Email", included: true },
        { text: "Certificado SSL", included: true },
        { text: "Painel cPanel", included: true },
        { text: "Backup Diário", included: true },
        { text: "Suporte 24/7 Premium", included: true },
      ],
    },
  ];

  // Calculate price with multi-year discounts
  const calculateYearlyPrice = (basePrice: number, years: number) => {
    // Apply discount for multi-year plans (5% per additional year)
    let discount = 0;
    if (years > 1) {
      discount = (years - 1) * 0.05;
    }
    return Math.round(basePrice * years * (1 - discount));
  };

  const yearlyHostingPlans = hostingPlans.map(plan => ({
    ...plan,
    price: formatPrice(calculateYearlyPrice(plan.basePrice, parseInt(billingYears))),
    period: `${billingYears} ${parseInt(billingYears) === 1 ? 'ano' : 'anos'}`
  }));
  
  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setShowDialog(true);
    setIsDomainValid(false);
    setDomainName("");
  };
  
  const handleDomainValidated = (domain: string) => {
    setDomainName(domain);
    setIsDomainValid(true);
  };
  
  const handleAddToCart = () => {
    if (!selectedPlan) return;
    
    if (dialogTab === "register") {
      // Adding hosting with domain registration
      if (!isDomainValid) {
        toast.error("Por favor, verifique a disponibilidade do domínio primeiro");
        return;
      }
      
      // First add domain to cart
      addToCart({
        id: `domain-${Date.now()}`,
        title: `Domínio ${domainName}`,
        price: 5000, // Domain registration price
        basePrice: 5000,
        quantity: 1,
        type: 'domain',
        years: parseInt(billingYears),
        domain: domainName
      });
      
      toast.success(`Domínio ${domainName} adicionado ao carrinho`);
    }
    
    // Add the hosting plan to cart
    const hostingItem = {
      id: `hosting-${Date.now()}`,
      title: `Hospedagem ${selectedPlan.title}`,
      price: calculateYearlyPrice(selectedPlan.basePrice, parseInt(billingYears)),
      basePrice: selectedPlan.basePrice,
      quantity: 1,
      type: 'hosting',
      years: parseInt(billingYears),
      description: selectedPlan.description,
      domain: dialogTab === "register" ? domainName : undefined
    };
    
    addToCart(hostingItem);
    toast.success(`Plano ${selectedPlan.title} adicionado ao carrinho`);
    setShowDialog(false);
    setSelectedPlan(null);
    setDomainName("");
    setIsDomainValid(false);
    
    // Navigate to cart
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="bg-muted/50 py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Hospedagem cPanel</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Nossa hospedagem cPanel oferece alto desempenho, segurança e facilidade de uso para gerenciar seus sites.
            </p>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="container">
          <div className="max-w-xs mx-auto mb-8">
            <Select value={billingYears} onValueChange={setBillingYears}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ano</SelectItem>
                <SelectItem value="2">2 anos</SelectItem>
                <SelectItem value="3">3 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {yearlyHostingPlans.map((plan) => (
              <PricingCard
                key={plan.title}
                {...plan}
                ctaText="Adicionar ao carrinho"
                onAction={() => handlePlanSelect(plan)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Todos os planos incluem</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nossos planos são cheios de recursos para oferecer a melhor experiência de hospedagem.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              "Painel cPanel",
              "Certificado SSL Grátis",
              "99.9% de Uptime",
              "Suporte 24/7",
              "Instalador WordPress",
              "Backup Automático",
              "PHP Atualizado",
              "Base de Dados MySQL",
              "Criador de Sites",
              "Firewall Avançado",
              "Proteção DDoS",
              "Migração Gratuita",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ainda está com dúvidas?</h2>
            <p className="mb-6 text-primary-foreground/90">
              Nossa equipe está pronta para ajudar você a escolher o melhor plano para o seu projeto.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="secondary"
                size="lg"
              >
                Fale com Especialista
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Ver FAQ
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Domain registration/existing domain dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Hospedagem</DialogTitle>
            <DialogDescription>
              Escolha entre registrar um novo domínio ou usar um domínio que você já possui.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="register" value={dialogTab} onValueChange={setDialogTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Registrar novo domínio</TabsTrigger>
              <TabsTrigger value="existing">Usar domínio existente</TabsTrigger>
            </TabsList>
            
            <TabsContent value="register" className="mt-4">
              <div className="space-y-4">
                <div className="grid w-full gap-2">
                  <label htmlFor="domainName" className="text-sm font-medium">Nome do domínio</label>
                  <DomainValidator onDomainValidated={handleDomainValidated} />
                </div>
                {isDomainValid && domainName && (
                  <div className="bg-green-50 p-3 rounded border border-green-200 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700">Domínio {domainName} está disponível!</span>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  O registro de domínio tem uma taxa adicional de {formatPrice(5000)}/ano
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="existing" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm">
                  Se você já possui um domínio com outro provedor, você pode usá-lo com nossa hospedagem.
                </p>
                <p className="text-sm font-medium">
                  Após a contratação, enviaremos instruções sobre como apontar seu domínio para nossos servidores.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAddToCart} 
              disabled={dialogTab === "register" && !isDomainValid}
            >
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CpanelHosting;
