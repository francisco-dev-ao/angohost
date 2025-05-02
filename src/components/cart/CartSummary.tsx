
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/formatters";
import { AlertCircle, Info, ShoppingCart, Clock, Check, Trash } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  hasUnownedDomains: boolean;
  hasDomains: boolean;
  onClearCart: () => void;
}

const CartSummary = ({ 
  subtotal, 
  hasUnownedDomains,
  hasDomains,
  onClearCart
}: CartSummaryProps) => {
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const calculateDiscount = () => {
      if (subtotal >= 500000) return 0.1; // 10% discount
      if (subtotal >= 250000) return 0.05; // 5% discount
      return 0;
    };

    const discountValue = calculateDiscount();
    setDiscount(discountValue);
    setTotal(subtotal - (subtotal * discountValue));
  }, [subtotal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border rounded-lg shadow-md bg-white overflow-hidden h-fit sticky top-8"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-background p-6 border-b">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Desconto ({(discount * 100)}%)</span>
              <span>-{formatPrice(subtotal * discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span className="text-primary text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full gap-2" 
            onClick={() => navigate('/enhanced-checkout')}
            disabled={hasUnownedDomains || !hasDomains}
          >
            <ShoppingCart className="h-4 w-4" />
            Finalizar Compra
          </Button>
          
          {hasDomains && (
            <Button 
              variant="outline" 
              className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" 
              onClick={onClearCart}
            >
              <Trash className="h-4 w-4" />
              Limpar Carrinho
            </Button>
          )}
        </div>
        
        {!hasDomains && (
          <div className="text-sm text-amber-500 mt-2 flex items-center gap-2 p-3 bg-amber-50 rounded-md">
            <Info className="h-4 w-4 flex-shrink-0" />
            <span>É necessário adicionar pelo menos um domínio para prosseguir com a compra</span>
          </div>
        )}
        
        {hasUnownedDomains && (
          <div className="text-sm text-red-500 mt-2 flex items-center gap-2 p-3 bg-red-50 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>Preencha as informações de titularidade para todos os domínios antes de continuar</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-green-500" />
          <span>Pagamento 100% seguro</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CartSummary;
