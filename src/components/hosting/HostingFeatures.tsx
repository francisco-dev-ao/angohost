
import React from "react";
import { Check } from "lucide-react";

const HostingFeatures = () => {
  const features = [
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
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Todos os planos incluem</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Nossos planos são cheios de recursos para oferecer a melhor experiência de hospedagem.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {features.map((feature, i) => (
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
  );
};

export default HostingFeatures;
