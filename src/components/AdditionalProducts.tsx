
import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { Card } from '@/components/ui/card';

interface Product {
  id: string;
  title: string;
  description: string;
  basePrice: number;
}

interface AdditionalProductsProps {
  title?: string;
  products: Product[];
}

const AdditionalProducts = ({ title = "Produtos Adicionais", products }: AdditionalProductsProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: `${product.title}-${Date.now()}`,
      name: product.title, // Ensure name property exists
      title: product.title,
      price: product.basePrice,
      basePrice: product.basePrice,
      quantity: 1,
      description: product.description
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-6 flex flex-col justify-between">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">{product.title}</h3>
              <p className="text-muted-foreground text-sm">{product.description}</p>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold">{formatPrice(product.basePrice)}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdditionalProducts;
