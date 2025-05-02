import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/utils/formatters';

interface DomainExtension {
  id: string;
  extension: string;
  price: number;
  renewal_price: number;
  description: string;
  is_popular: boolean;
  is_active: boolean;
}

const DomainSearch = () => {
  const [domain, setDomain] = useState('');
  const [availableExtensions, setAvailableExtensions] = useState<DomainExtension[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);
  const [domainPrice, setDomainPrice] = useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchExtensions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/domain-extensions');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAvailableExtensions(data);
      } catch (error) {
        console.error("Could not fetch domain extensions:", error);
        toast.error("Falha ao carregar extensões de domínio.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  const handleSearch = async () => {
    if (!domain) {
      toast.error("Por favor, insira um domínio para pesquisar.");
      return;
    }

    // Basic domain validation
    const domainRegex = /^(?!:\/\/)(?:[a-zA-Z0-9-]{1,63}\.){0,125}[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$/;
    if (!domainRegex.test(domain)) {
      toast.error("Por favor, insira um domínio válido.");
      return;
    }

    // Find the .ao extension and set its price
    const aoExtension = availableExtensions.find(ext => ext.extension === '.ao');
    if (aoExtension) {
      setDomainPrice(aoExtension.price);
    } else {
      setDomainPrice(75); // Default .ao price if not found
    }
  };

  const handleAddToCart = (domain: string, price: number) => {
    addToCart({
      id: `domain-${domain}-${Date.now()}`,
      name: `Domínio: ${domain}`,
      title: `Domínio: ${domain}`,
      quantity: 1,
      price: price,
      basePrice: price,
      type: 'domain',
      domain: domain,
      years: 1
    });
    
    toast.success(`Domínio ${domain} adicionado ao carrinho!`);
    setCartAdded(true);
  };

  const handleSelectWithHosting = (domain: string) => {
    // First, add the domain to the cart
    addToCart({
      id: `domain-${domain}-${Date.now()}`,
      name: `Domínio: ${domain}`,
      title: `Domínio: ${domain}`,
      quantity: 1,
      price: domainPrice,
      basePrice: domainPrice,
      type: 'domain',
      domain: domain,
      years: 1
    });
    
    // Then navigate to hosting page with domain pre-selected
    navigate(`/hosting?domain=${domain}`);
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Input
            type="text"
            placeholder="Pesquise o seu domínio"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pesquisando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Pesquisar
              </>
            )}
          </Button>
          {domain && !cartAdded && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddToCart(domain, domainPrice)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {formatPrice(domainPrice)}
              </Button>
              <Button
                size="sm"
                onClick={() => handleSelectWithHosting(domain)}
              >
                Contratar com Hosting
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainSearch;
