
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const EmptyCartNotice = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carrinho vazio</CardTitle>
        <CardDescription>Não há itens para finalizar a compra</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => navigate('/domains')}>Voltar para loja</Button>
      </CardFooter>
    </Card>
  );
};

export default EmptyCartNotice;
