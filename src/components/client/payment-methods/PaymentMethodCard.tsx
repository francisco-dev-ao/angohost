
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { CreditCard, Trash } from "lucide-react";
import { PaymentMethod } from "@/types/client";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

const PaymentMethodCard = ({ method, onSetDefault, onRemove }: PaymentMethodCardProps) => {
  return (
    <Card key={method.id}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <CreditCard className="text-primary" size={24} />
            <div>
              <CardTitle>
                {method.card_brand || 'Cartão'} •••• {method.card_last_four}
                {method.is_default && (
                  <Badge className="ml-2 bg-primary">Padrão</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {method.billing_name} • Expira em {method.card_expiry}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      {method.billing_address && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Endereço de Cobrança:</span> {method.billing_address}
          </p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between">
        {!method.is_default && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSetDefault(method.id)}
          >
            Definir como Padrão
          </Button>
        )}
        <Button 
          variant="destructive" 
          size="icon"
          onClick={() => onRemove(method.id)}
        >
          <Trash size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethodCard;
