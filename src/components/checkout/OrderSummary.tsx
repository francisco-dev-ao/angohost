
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from '@/utils/formatters';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, Package, Shield, Clock } from 'lucide-react';

interface OrderSummaryProps {
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  billingCycle: string;
  handleBillingCycleChange: (cycle: string) => void;
}

const OrderSummary = ({
  items,
  subtotal,
  discount,
  total,
  billingCycle,
  handleBillingCycleChange
}: OrderSummaryProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="sticky top-4 shadow-md border-primary/10">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-background pb-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <CardTitle>Resumo do Pedido</CardTitle>
          </div>
          <Badge variant="outline" className="w-fit">
            {items.length} {items.length === 1 ? 'Item' : 'Itens'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Billing Cycle Selection - Now more prominent */}
          <div className="rounded-lg border p-4 bg-muted/30">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              Ciclo de Cobrança
            </h3>
            <RadioGroup 
              value={billingCycle} 
              onValueChange={handleBillingCycleChange}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual" className="cursor-pointer">Anual</Label>
              </div>
            </RadioGroup>
          </div>
          
          {items.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <motion.div 
                    key={item.id} 
                    className="rounded-md p-3 border bg-background hover:bg-muted/20 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between">
                      <div className="text-sm">
                        <p className="font-medium">{item.title}</p>
                        {item.domain && (
                          <span className="text-xs text-muted-foreground block">
                            Domínio: {item.domain}
                          </span>
                        )}
                        {item.renewalDate && (
                          <span className="text-xs text-muted-foreground block">
                            Renovação: {item.renewalDate}
                          </span>
                        )}
                        {/* Show service period info if available */}
                        {item.years && (
                          <span className="text-xs text-primary block mt-1">
                            Período: {item.years} {item.years === 1 ? 'ano' : 'anos'}
                          </span>
                        )}
                      </div>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="text-sm">Desconto</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              
              <div className="rounded-md bg-muted/20 p-3 flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 mt-0.5" />
                <p className="text-muted-foreground">
                  Seu pedido será processado após a confirmação do pagamento
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Ativação imediata após pagamento</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mx-auto opacity-20 mb-2" />
              Nenhum item no carrinho
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummary;
