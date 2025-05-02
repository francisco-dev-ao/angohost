
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface EmptyPaymentMethodsProps {
  onAddNew: () => void;
}

const EmptyPaymentMethods = ({ onAddNew }: EmptyPaymentMethodsProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Nenhum método de pagamento encontrado</CardTitle>
        <CardDescription>
          Adicione um método de pagamento para efetuar compras.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <Button onClick={onAddNew}>
          Adicionar Método de Pagamento
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyPaymentMethods;
