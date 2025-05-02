
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContactProfiles } from "@/hooks/useContactProfiles";

interface DomainSelectionProps {
  config: {
    domainOption: string;
    newDomainName: string;
    selectedExistingDomain: string;
    contactProfileId: string;
  };
  onConfigChange: (key: string, value: any) => void;
}

const DomainSelection = ({ config, onConfigChange }: DomainSelectionProps) => {
  const { profiles, isLoading: isLoadingProfiles } = useContactProfiles();
  const [domains, setDomains] = useState<string[]>([]);
  const [isLoadingDomains, setIsLoadingDomains] = useState(false);
  const [domainAvailable, setDomainAvailable] = useState<boolean | null>(null);
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);

  useEffect(() => {
    const fetchUserDomains = async () => {
      setIsLoadingDomains(true);
      try {
        const { data } = await supabase
          .from('client_domains')
          .select('domain_name')
          .eq('status', 'active');

        if (data && data.length > 0) {
          setDomains(data.map(d => d.domain_name));
          if (data.length > 0) {
            onConfigChange('selectedExistingDomain', data[0].domain_name);
          }
        } else {
          setDomains(["exemplo.co.ao", "minhaempresa.ao", "meudominio.com"]);
          onConfigChange('selectedExistingDomain', "exemplo.co.ao");
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
        setDomains(["exemplo.co.ao", "minhaempresa.ao", "meudominio.com"]);
        onConfigChange('selectedExistingDomain', "exemplo.co.ao");
      } finally {
        setIsLoadingDomains(false);
      }
    };

    fetchUserDomains();
    
    if (profiles && profiles.length > 0) {
      onConfigChange('contactProfileId', profiles[0].id);
    }
  }, [profiles]);

  const checkDomainAvailability = () => {
    if (!config.newDomainName || config.newDomainName.trim() === "") {
      return;
    }
    
    setIsCheckingDomain(true);
    setDomainAvailable(null);
    
    setTimeout(() => {
      const isAvailable = Math.random() > 0.2;
      setDomainAvailable(isAvailable);
      setIsCheckingDomain(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label className="text-right mt-2">
        Domínio
      </Label>
      <div className="col-span-3 space-y-4">
        <RadioGroup 
          value={config.domainOption}
          onValueChange={(value) => onConfigChange('domainOption', value)}
        >
          <div className="flex items-start space-x-2">
            <RadioGroupItem value="new" id="domain-new" />
            <div className="grid gap-1.5">
              <Label htmlFor="domain-new" className="font-medium">
                Registrar um novo domínio
              </Label>
              <p className="text-sm text-muted-foreground">
                Adiciona custo extra para registro do domínio
              </p>
              
              {config.domainOption === "new" && (
                <div className="pt-2 space-y-4">
                  <div>
                    <Label htmlFor="domain-name">Nome do domínio</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="domain-name"
                        placeholder="exemplo.ao"
                        value={config.newDomainName}
                        onChange={(e) => onConfigChange('newDomainName', e.target.value)}
                      />
                      <Button
                        type="button"
                        onClick={checkDomainAvailability}
                        disabled={isCheckingDomain || !config.newDomainName}
                      >
                        {isCheckingDomain ? "Verificando..." : "Verificar"}
                      </Button>
                    </div>
                    {domainAvailable === true && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <Check className="h-4 w-4 mr-1"/> Domínio disponível!
                      </p>
                    )}
                    {domainAvailable === false && (
                      <p className="text-red-600 text-sm mt-1">
                        Domínio não disponível. Tente outro.
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-profile">Perfil de contato para o domínio</Label>
                    <Select
                      value={config.contactProfileId}
                      onValueChange={(value) => onConfigChange('contactProfileId', value)}
                      disabled={isLoadingProfiles}
                    >
                      <SelectTrigger id="contact-profile" className="mt-1">
                        <SelectValue placeholder="Selecione um perfil de contato" />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingProfiles ? (
                          <SelectItem value="loading" disabled>Carregando perfis...</SelectItem>
                        ) : profiles && profiles.length > 0 ? (
                          profiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>
                              {profile.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>Nenhum perfil encontrado</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-2 mt-3">
            <RadioGroupItem value="existing" id="domain-existing" />
            <div className="grid gap-1.5">
              <Label htmlFor="domain-existing" className="font-medium">
                Usar um domínio existente
              </Label>
              <p className="text-sm text-muted-foreground">
                Selecione um dos seus domínios já registrados
              </p>
              
              {config.domainOption === "existing" && (
                <div className="pt-2">
                  <Select
                    value={config.selectedExistingDomain}
                    onValueChange={(value) => onConfigChange('selectedExistingDomain', value)}
                    disabled={isLoadingDomains || domains.length === 0}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione um domínio" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingDomains ? (
                        <SelectItem value="loading" disabled>Carregando domínios...</SelectItem>
                      ) : domains.length > 0 ? (
                        domains.map(domain => (
                          <SelectItem key={domain} value={domain}>
                            {domain}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>Nenhum domínio encontrado</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default DomainSelection;
