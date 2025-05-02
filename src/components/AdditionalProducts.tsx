
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface AdditionalProduct {
  id: string;
  title: string;
  description: string;
  price: number;
}

const additionalProducts: AdditionalProduct[] = [
  {
    id: 'ssl-standard',
    title: 'Certificado SSL Standard',
    description: 'Proteja seu site com criptografia SSL',
    price: 19900,
  },
  {
    id: 'backup-service',
    title: 'Serviço de Backup',
    description: 'Backup diário automatizado',
    price: 9900,
  },
];

const AdditionalProducts = () => {
  const { addToCart } = useCart();

  const handleAddProduct = (product: AdditionalProduct) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      basePrice: product.price,
      quantity: 1,
    });
    toast.success(`${product.title} adicionado ao carrinho!`);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Produtos Adicionais</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {additionalProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.title}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{product.price.toFixed(2)} kz</span>
                <Button variant="outline" onClick={() => handleAddProduct(product)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdditionalProducts;
