
import React from "react";
import PricingCard from "@/components/PricingCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/utils/formatters";

interface HostingPricingSectionProps {
  billingYears: string;
  setBillingYears: (value: string) => void;
  hostingPlans: any[];
  onPlanSelect: (plan: any) => void;
}

const HostingPricingSection = ({
  billingYears,
  setBillingYears,
  hostingPlans,
  onPlanSelect
}: HostingPricingSectionProps) => {
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

  return (
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
              onAction={() => onPlanSelect(plan)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HostingPricingSection;
