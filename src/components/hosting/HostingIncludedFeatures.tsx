
import React from 'react';

const HostingIncludedFeatures = () => {
  return (
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
  );
};

export default HostingIncludedFeatures;
