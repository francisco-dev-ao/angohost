
import React from "react";
import { Button } from "@/components/ui/button";

const HostingCTA = () => {
  return (
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
  );
};

export default HostingCTA;
