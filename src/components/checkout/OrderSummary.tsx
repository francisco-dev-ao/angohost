
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/utils/formatters";

interface OrderSummaryProps {
  currentStep: number;
  canProceed?: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const OrderSummary = ({ currentStep, canProceed = false, onSubmit }: OrderSummaryProps) => {
  const { items, total } = useCart();

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" /> 
          Resumo do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ul className="divide-y">
            {items.map((item, index) => (
              <li key={index} className="py-2">
                <div className="flex justify-between">
                  <div className="pr-2">
                    <p className="font-medium">{item.title}</p>
                    {item.domain && <p className="text-sm text-muted-foreground">Domínio: {item.domain}</p>}
                  </div>
                  <p className="text-right">{formatPrice(item.price)}</p>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <Separator className="my-4" />
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {currentStep === 2 && (
          <form onSubmit={onSubmit} className="w-full">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!canProceed}
            >
              Finalizar Compra <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        )}
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
