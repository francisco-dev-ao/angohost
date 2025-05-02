
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPaymentMethod: {
    cardNumber: string;
    cardName: string;
    cardExpiry: string;
    cardCvv: string;
    billingAddress: string;
  };
  onNewPaymentMethodChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

const AddPaymentMethodDialog = ({ 
  open, 
  onOpenChange, 
  newPaymentMethod, 
  onNewPaymentMethodChange,
  onSubmit 
}: AddPaymentMethodDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
          <DialogDescription>
            Preencha os dados do seu cartão para adicionar um novo método de pagamento.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Número do Cartão</Label>
            <Input 
              id="cardNumber" 
              placeholder="1234 5678 9012 3456" 
              value={newPaymentMethod.cardNumber}
              onChange={(e) => onNewPaymentMethodChange('cardNumber', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardName">Nome no Cartão</Label>
            <Input 
              id="cardName" 
              placeholder="Nome completo" 
              value={newPaymentMethod.cardName}
              onChange={(e) => onNewPaymentMethodChange('cardName', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Data de Expiração</Label>
              <Input 
                id="cardExpiry" 
                placeholder="MM/AA" 
                value={newPaymentMethod.cardExpiry}
                onChange={(e) => onNewPaymentMethodChange('cardExpiry', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardCvv">CVV</Label>
              <Input 
                id="cardCvv" 
                placeholder="123" 
                value={newPaymentMethod.cardCvv}
                onChange={(e) => onNewPaymentMethodChange('cardCvv', e.target.value)}
                maxLength={4}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingAddress">Endereço de Cobrança</Label>
            <Input 
              id="billingAddress" 
              placeholder="Endereço completo" 
              value={newPaymentMethod.billingAddress}
              onChange={(e) => onNewPaymentMethodChange('billingAddress', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={onSubmit}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentMethodDialog;
