
import React from 'react';

interface HostingHeaderProps {
  title?: string;
  description?: string;
}

const HostingHeader = ({ 
  title = "Hospedagem de Sites", 
  description = "Escolha o plano ideal para seu projeto com a melhor relação custo-benefício" 
}: HostingHeaderProps) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
};

export default HostingHeader;
