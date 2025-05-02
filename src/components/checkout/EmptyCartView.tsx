
import React from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const EmptyCartView = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto text-center bg-white p-12 rounded-lg shadow-sm">
      <div className="mb-6 flex justify-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio</h1>
      <p className="text-muted-foreground mb-8">Não há itens no seu carrinho para finalizar a compra.</p>
      <div className="space-y-4">
        <Button onClick={() => navigate('/domains')} className="px-8">
          Pesquisar domínios
        </Button>
        <div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="px-8"
          >
            Continuar explorando
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCartView;
