
import React from "react";
import { Button } from "@/components/ui/button";

interface HostingHeaderProps {
  title?: string;
  description?: string;
  totalServices?: number;
  onCreateNew?: () => void;
}

const HostingHeader = ({ 
  title = "Hospedagem", 
  description = "Gerenciar serviços de hospedagem",
  totalServices,
  onCreateNew
}: HostingHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">
          {description}
          {totalServices !== undefined && ` (${totalServices} serviços)`}
        </p>
      </div>
      {onCreateNew && (
        <Button onClick={onCreateNew}>
          Criar Novo Serviço
        </Button>
      )}
    </div>
  );
};

export default HostingHeader;
