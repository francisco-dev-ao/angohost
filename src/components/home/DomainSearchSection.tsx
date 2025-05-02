
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import DomainValidator from '@/components/DomainValidator';

interface DomainSearchSectionProps {
  onDomainSelected?: (domain: string) => void;
}

const DomainSearchSection: React.FC<DomainSearchSectionProps> = ({ onDomainSelected }) => {
  // Se onDomainSelected for fornecido, use o componente DomainValidator
  if (onDomainSelected) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <DomainValidator onDomainValidated={onDomainSelected} />
      </div>
    );
  }

  // Caso contrário, use um formulário de pesquisa mais simples que redireciona para /domains
  return (
    <div className="w-full max-w-3xl mx-auto">
      <form action="/domains" method="get" className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            name="domain"
            type="text"
            placeholder="Digite o nome do seu domínio..."
            className="pl-10"
          />
        </div>
        <Button type="submit">Verificar</Button>
      </form>
    </div>
  );
};

export default DomainSearchSection;
