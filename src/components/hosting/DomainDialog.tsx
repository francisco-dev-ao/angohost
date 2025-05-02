
import React, { useState } from "react";
import { Check } from "lucide-react";
import { formatPrice } from "@/utils/formatters";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DomainValidator from "@/components/DomainValidator";

interface DomainDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  dialogTab: string;
  setDialogTab: (tab: string) => void;
  domainName: string;
  isDomainValid: boolean;
  onDomainValidated: (domain: string) => void;
  handleAddToCart: () => void;
}

const DomainDialog = ({
  showDialog,
  setShowDialog,
  dialogTab,
  setDialogTab,
  domainName,
  isDomainValid,
  onDomainValidated,
  handleAddToCart
}: DomainDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Hospedagem</DialogTitle>
          <DialogDescription>
            Escolha entre registrar um novo domínio ou usar um domínio que você já possui.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="register" value={dialogTab} onValueChange={setDialogTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Registrar novo domínio</TabsTrigger>
            <TabsTrigger value="existing">Usar domínio existente</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="mt-4">
            <div className="space-y-4">
              <div className="grid w-full gap-2">
                <label htmlFor="domainName" className="text-sm font-medium">Nome do domínio</label>
                <DomainValidator onDomainValidated={onDomainValidated} />
              </div>
              {isDomainValid && domainName && (
                <div className="bg-green-50 p-3 rounded border border-green-200 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">Domínio {domainName} está disponível!</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                O registro de domínio tem uma taxa adicional de {formatPrice(5000)}/ano
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="existing" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm">
                Se você já possui um domínio com outro provedor, você pode usá-lo com nossa hospedagem.
              </p>
              <p className="text-sm font-medium">
                Após a contratação, enviaremos instruções sobre como apontar seu domínio para nossos servidores.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddToCart} 
            disabled={dialogTab === "register" && !isDomainValid}
          >
            Continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DomainDialog;
