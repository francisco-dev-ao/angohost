
import { useMemo } from "react";

export interface HostingPlanFeature {
  text: string;
  included: boolean;
}

export interface HostingPlan {
  title: string;
  description: string;
  basePrice: number;
  popular?: boolean;
  features: HostingPlanFeature[];
}

export const useHostingPlans = () => {
  const hostingPlans = useMemo<HostingPlan[]>(() => [
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
    }
  ], []);

  return { hostingPlans };
};
