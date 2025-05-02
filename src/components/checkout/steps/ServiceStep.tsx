
import React from "react";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, PlusCircle, Trash, Package, Clock, Check } from "lucide-react";
import { formatPrice, parsePrice } from '@/utils/formatters';
import { CartItem } from '@/contexts/CartContext';
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ServiceStepProps {
  items: CartItem[];
  prevStep: () => void;
  nextStep: () => void;
  onRemoveItem?: (id: string) => void;
  onUpdateBillingCycle?: (itemId: string, years: number) => void;
}

const ServiceStep = ({ 
  items, 
  prevStep, 
  nextStep, 
  onRemoveItem,
  onUpdateBillingCycle
}: ServiceStepProps) => {
  const handleRemoveItem = (id: string) => {
    if (onRemoveItem) {
      onRemoveItem(id);
      toast.success("Item removido do pedido");
    }
  };

  const handleBillingCycleChange = (itemId: string, years: number) => {
    if (onUpdateBillingCycle) {
      onUpdateBillingCycle(itemId, years);
    }
  };

  // Check if only domains are in the cart
  const hasOnlyDomains = items.length > 0 && items.every(item => item.type === 'domain');
  
  const nonDomainItems = items.filter(item => item.type !== 'domain');
  const domainItems = items.filter(item => item.type === 'domain');

  return (
    <>
      <CardTitle className="mb-4">Serviços Contratados</CardTitle>
      <CardDescription className="mb-6">
        Revise e personalize os serviços do seu pedido
      </CardDescription>
      
      <div className="space-y-6">
        {domainItems.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="outline" className="rounded-md">Domínios</Badge>
            </h3>
            <div className="space-y-3">
              {domainItems.map(item => {
                const domainName = item.title.replace('Domínio ', '');
                const renewalDate = new Date();
                renewalDate.setFullYear(renewalDate.getFullYear() + (item.years || 1));
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between p-4 border rounded-md bg-background hover:bg-accent/5 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Próxima renovação: {renewalDate.toLocaleDateString()}
                      </p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Período de contratação:</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[1, 2, 3].map(years => (
                          <Button 
                            key={years}
                            variant={(item.years || 1) === years ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleBillingCycleChange(item.id, years)}
                            className="w-full"
                          >
                            {years} {years === 1 ? 'ano' : 'anos'}
                            {years > 1 && <span className="ml-1 text-xs bg-primary-foreground text-primary px-1 py-0.5 rounded">-{(years-1)*5}%</span>}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <div className="text-right">
                        <div className="font-medium">{formatPrice(item.price)}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.years} {item.years === 1 ? 'ano' : 'anos'}
                        </div>
                      </div>
                      
                      {onRemoveItem && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
        
        {nonDomainItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-md border overflow-hidden"
          >
            <div className="p-4 bg-background">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(item.price)}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity} x {formatPrice(item.basePrice)}
                    </div>
                  </div>
                  {onRemoveItem && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Período de contratação
                </h4>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[1, 2, 3].map(years => (
                    <Button 
                      key={years}
                      variant={(item.years || 1) === years ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleBillingCycleChange(item.id, years)}
                      className="w-full"
                    >
                      {years} {years === 1 ? 'ano' : 'anos'}
                      {years > 1 && <span className="ml-1 text-xs bg-primary-foreground text-primary px-1 py-0.5 rounded">-{(years-1)*5}%</span>}
                    </Button>
                  ))}
                </div>
                
                {item.domain && (
                  <div className="mt-3 p-3 bg-accent/20 rounded-md">
                    <p className="text-sm font-medium">Domínio associado:</p>
                    <p className="text-sm">{item.domain}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Recommended services, more prominent when users only have domains */}
        {hasOnlyDomains && (
          <div className="mt-8 border p-5 rounded-lg bg-gradient-to-r from-primary/5 to-background">
            <h3 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" />
              Serviços Recomendados
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Email Corporate Plan */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <h4 className="font-medium">Email Corporativo</h4>
                <p className="text-sm text-muted-foreground mb-4">Email profissional com seu domínio</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>5GB de armazenamento</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Antispam e antivírus</span>
                  </li>
                </ul>
                <div className="text-primary font-semibold mb-3">{formatPrice(20000)}/usuário</div>
                <Button variant="outline" className="w-full group">
                  Adicionar
                  <PlusCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </motion.div>
              
              {/* Hosting Plan */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <h4 className="font-medium">Hospedagem Web</h4>
                <p className="text-sm text-muted-foreground mb-4">Hospede seu site com alta performance</p>
                <ul className="text-sm space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>10GB SSD</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>SSL Grátis</span>
                  </li>
                </ul>
                <div className="text-primary font-semibold mb-3">{formatPrice(25000)}/ano</div>
                <Button variant="outline" className="w-full group">
                  Adicionar
                  <PlusCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-4 border rounded-md p-4 flex justify-between items-center bg-accent/10"
            >
              <div>
                <h4 className="font-medium">Proteção SSL</h4>
                <p className="text-sm text-muted-foreground">Certificado SSL para garantir a segurança do seu site</p>
              </div>
              <Button variant="outline" className="group">
                Adicionar
                <PlusCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={prevStep}
        >
          Voltar
        </Button>
        <Button 
          type="button" 
          onClick={nextStep}
          className="group"
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </>
  );
};

export default ServiceStep;
