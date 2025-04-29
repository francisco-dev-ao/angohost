
export interface EmailPlan {
  id: string;
  title: string;
  description: string;
  basePrice: number;
  renewalPrice: number;
  features: { text: string; included: boolean; }[];
  popular?: boolean;
}

export const emailPlans: EmailPlan[] = [
  {
    id: "premium",
    title: "Email Premium",
    description: "Para pequenas empresas e profissionais",
    basePrice: 12000,
    renewalPrice: 14500,
    features: [
      { text: "5GB por usuário", included: true },
      { text: "IMAP/POP", included: true },
      { text: "Reputação do IP limpo", included: true },
      { text: "Classificado pelo Google", included: true },
      { text: "Acesso webmail", included: true },
      { text: "Suporte básico", included: true },
      { text: "Anti-spam básico", included: true },
      { text: "Calendário compartilhado", included: false }
    ]
  },
  {
    id: "business",
    title: "Business",
    description: "Para empresas em crescimento",
    basePrice: 30000,
    renewalPrice: 32000,
    features: [
      { text: "30GB por usuário", included: true },
      { text: "IMAP/POP", included: true },
      { text: "Reputação do IP limpo", included: true },
      { text: "Classificado pelo Google", included: true },
      { text: "Acesso webmail", included: true },
      { text: "Suporte prioritário", included: true },
      { text: "Anti-spam avançado", included: true },
      { text: "Calendário compartilhado", included: true }
    ]
  },
  {
    id: "advanced",
    title: "Avançado Pro",
    description: "Para grandes empresas",
    basePrice: 40000,
    renewalPrice: 42000,
    popular: true,
    features: [
      { text: "50GB por usuário", included: true },
      { text: "Regras de Encaminhamento", included: true },
      { text: "Aliases de email", included: true },
      { text: "Verificação Antivírus", included: true },
      { text: "Anti-spam avançado", included: true },
      { text: "Infraestrutura baseada na cloud", included: true },
      { text: "Suporte dedicado", included: true },
      { text: "Backup diário", included: true }
    ]
  }
];

export const getPlanById = (id: string): EmailPlan | undefined => {
  return emailPlans.find(plan => plan.id === id);
};
