
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Pedido realizado com sucesso!</CardTitle>
          <CardDescription>
            Seu pedido foi recebido e está sendo processado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Você será redirecionado para a página de pedidos em instantes.
          </p>
          <Button onClick={() => navigate('/client/orders')}>
            Ver meus pedidos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
