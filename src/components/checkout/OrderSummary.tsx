
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/formatters";
import { Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";

interface OrderSummaryProps {
  currentStep: number;
  canProceed: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const OrderSummary = ({ onSubmit, currentStep, canProceed }: OrderSummaryProps) => {
  const { items, total } = useCart();
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <div>
              <p className="font-medium">{item.title || item.name}</p>
              <p className="text-muted-foreground">{item.description || 'Serviço padrão'}</p>
            </div>
            <div className="text-right">
              <p>{formatPrice(item.price * item.quantity)}</p>
              <p className="text-xs text-muted-foreground">Qtd: {item.quantity}</p>
            </div>
          </div>
        ))}
        
        <Separator />
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          {subtotal !== total && (
            <div className="flex justify-between text-sm">
              <span>Desconto</span>
              <span>- {formatPrice(subtotal - total)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        {currentStep === 2 && (
          <Button 
            type="submit"
            className="w-full"
            disabled={!canProceed}
            onClick={(e: React.FormEvent) => onSubmit(e)}
          >
            <Lock className="h-4 w-4 mr-2" />
            Finalizar Pedido
          </Button>
        )}
        
        {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-md p-3 text-center text-green-800"
          >
            <p className="text-sm">
              Sua compra está sendo processada. Você receberá uma confirmação por e-mail.
            </p>
          </motion.div>
        )}
        
        <div className="flex items-center justify-center text-xs text-muted-foreground">
          <Lock className="h-3 w-3 mr-1" />
          Pagamento seguro
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
