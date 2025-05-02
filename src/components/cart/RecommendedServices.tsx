
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PricingCard from "@/components/PricingCard";
import { formatPrice } from "@/utils/formatters";
import { AlertCircle } from "lucide-react";
import { emailPlans } from "@/config/emailPlans";

interface RecommendedServicesProps {
  hasDomains: boolean;
  selectedBillingPeriod: string;
  onAddProduct: (product: any, years: number) => void;
  onEmailPlanClick: (plan: any) => void;
}

const RecommendedServices = ({
  hasDomains,
  selectedBillingPeriod,
  onAddProduct,
  onEmailPlanClick,
}: RecommendedServicesProps) => {
  const cpanelPlans = [
    {
      title: "Hospedagem Starter",
      description: "Para sites pessoais",
      basePrice: 20000,
      features: [
        { text: "1 website", included: true },
        { text: "10GB SSD", included: true },
        { text: "1 Banco de dados", included: true },
        { text: "5 Emails", included: true },
        { text: "SSL Grátis", included: true },
        { text: "cPanel incluído", included: true },
      ],
    },
    {
      title: "Hospedagem Business",
      description: "Para empresas",
      basePrice: 30000,
      popular: true,
      features: [
        { text: "10 websites", included: true },
        { text: "30GB SSD", included: true },
        { text: "10 Bancos de dados", included: true },
        { text: "30 Emails", included: true },
        { text: "SSL Grátis", included: true },
        { text: "cPanel incluído", included: true },
      ],
    }
  ];

  const wordpressPlans = [
    {
      title: "WordPress Basic",
      description: "Para blogs pessoais",
      basePrice: 25000,
      features: [
        { text: "1 Site WordPress", included: true },
        { text: "10GB SSD", included: true },
        { text: "WordPress Otimizado", included: true },
        { text: "Instalação em 1 clique", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
      ],
    },
    {
      title: "WordPress Pro",
      description: "Para negócios",
      basePrice: 45000,
      popular: true,
      features: [
        { text: "5 Sites WordPress", included: true },
        { text: "30GB SSD", included: true },
        { text: "WordPress Otimizado", included: true },
        { text: "Instalação em 1 clique", included: true },
        { text: "SSL Grátis", included: true },
        { text: "Backup Diário", included: true },
      ],
    }
  ];

  // Apply discount for multi-year plans
  const calculateEmailPrice = (basePrice: number) => {
    const years = parseInt(selectedBillingPeriod);
    const discountMultiplier = years > 1 ? 0.9 : 1;
    return formatPrice(Math.round(basePrice * discountMultiplier));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Recomendados</CardTitle>
        <CardDescription>
          Escolha serviços adicionais para seus domínios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {hasDomains ? (
            <Tabs defaultValue="email">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="email">Email Profissional</TabsTrigger>
                <TabsTrigger value="cpanel">Hospedagem cPanel</TabsTrigger>
                <TabsTrigger value="wordpress">Hospedagem WordPress</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <div className="grid md:grid-cols-2 gap-4">
                  {emailPlans.map((plan, index) => (
                    <PricingCard
                      key={index}
                      {...plan}
                      price={calculateEmailPrice(plan.basePrice)}
                      period={`usuário/${selectedBillingPeriod} ${parseInt(selectedBillingPeriod) === 1 ? 'ano' : 'anos'}`}
                      ctaText="Configurar plano"
                      onAction={() => onEmailPlanClick(plan)}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="cpanel">
                <div className="grid md:grid-cols-2 gap-4">
                  {cpanelPlans.map((plan, index) => (
                    <PricingCard
                      key={index}
                      {...plan}
                      price={formatPrice(plan.basePrice * parseInt(selectedBillingPeriod))}
                      period={`${selectedBillingPeriod} ${parseInt(selectedBillingPeriod) === 1 ? 'ano' : 'anos'}`}
                      ctaText="Adicionar ao carrinho"
                      onAction={() => onAddProduct(plan, parseInt(selectedBillingPeriod))}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="wordpress">
                <div className="grid md:grid-cols-2 gap-4">
                  {wordpressPlans.map((plan, index) => (
                    <PricingCard
                      key={index}
                      {...plan}
                      price={formatPrice(plan.basePrice * parseInt(selectedBillingPeriod))}
                      period={`${selectedBillingPeriod} ${parseInt(selectedBillingPeriod) === 1 ? 'ano' : 'anos'}`}
                      ctaText="Adicionar ao carrinho"
                      onAction={() => onAddProduct(plan, parseInt(selectedBillingPeriod))}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nenhum domínio no carrinho</AlertTitle>
              <AlertDescription>
                Adicione domínios ao seu carrinho para ver recomendações de serviços.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedServices;
