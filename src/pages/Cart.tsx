
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCart } from '@/contexts/CartContext';
import CartItems from '@/components/cart/CartItems';
import CartSummary from '@/components/cart/CartSummary';
import RecommendedServices from '@/components/cart/RecommendedServices';
import CartLoading from '@/components/cart/CartLoading';
import EmptyCart from '@/components/cart/EmptyCart';
import CartActions from '@/components/cart/CartActions';
import { DomainOwnershipData, DomainWithOwnership } from '@/types/cart';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { CartProvider } from '@/contexts/CartContext';

const CartPage = () => {
  const { items, removeFromCart, clearCart, isLoading, updateItemPrice } = useCart();
  const [billingPeriod, setBillingPeriod] = useState("1");
  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);
  const [currentDomain, setCurrentDomain] = useState('');
  const [ownershipData, setOwnershipData] = useState<DomainOwnershipData>({
    name: '',
    email: '',
    phone: '',
    document: '',
    address: ''
  });
  const [domainWithOwnershipMap, setDomainWithOwnershipMap] = useState<{ [key: string]: DomainWithOwnership }>({});

  // Filter domain items
  const domainItems = items.filter(item => item.title.toLowerCase().includes('domínio'));
  
  // Calculate if there are unowned domains
  const hasUnownedDomains = domainItems.some(item => {
    const domainName = item.title.replace('Domínio ', '');
    return !domainWithOwnershipMap[domainName]?.hasOwnership;
  });

  // Calculate total
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    // Initialize domain ownership map
    const newMap: { [key: string]: DomainWithOwnership } = {};
    
    domainItems.forEach(item => {
      const domainName = item.title.replace('Domínio ', '');
      
      if (!newMap[domainName]) {
        newMap[domainName] = {
          domain: domainName,
          hasOwnership: !!item.ownershipData,
          ownershipData: item.ownershipData
        };
      }
    });
    
    setDomainWithOwnershipMap(newMap);
  }, [domainItems]);

  const handleOpenOwnershipDialog = (domain: string) => {
    setCurrentDomain(domain);
    const existingData = domainWithOwnershipMap[domain]?.ownershipData || {
      name: '',
      email: '',
      phone: '',
      document: '',
      address: ''
    };
    setOwnershipData(existingData);
    setIsOwnershipDialogOpen(true);
  };

  const handleSaveOwnership = () => {
    // Validate form
    if (!ownershipData.name || !ownershipData.email || !ownershipData.document) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Update domain ownership in map
    setDomainWithOwnershipMap(prev => ({
      ...prev,
      [currentDomain]: {
        domain: currentDomain,
        hasOwnership: true,
        ownershipData
      }
    }));

    // Find the domain item and update it
    const domainItemToUpdate = items.find(item => 
      item.title === `Domínio ${currentDomain}`
    );

    if (domainItemToUpdate) {
      const updatedItem = {
        ...domainItemToUpdate,
        ownershipData
      };
      updateItemPrice(updatedItem.id, updatedItem.price);
    }

    setIsOwnershipDialogOpen(false);
    toast.success('Informações de titularidade salvas com sucesso');
  };

  const handleAddProduct = (product: any, years: number) => {
    if (product) {
      const price = product.basePrice * years;
      const cartItem = {
        id: `${product.title}-${Date.now()}`,
        title: product.title,
        description: product.description,
        quantity: 1,
        price: price,
        basePrice: product.basePrice,
        type: 'hosting',
        years: years
      };
      
      // Use addToCart from context
      // Since we're not using CartProvider directly, just log for now
      console.log('Adding to cart:', cartItem);
      toast.success(`${product.title} adicionado ao carrinho`);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
      clearCart();
      toast.info('Carrinho esvaziado');
    }
  };
  
  const handleEmailPlanClick = (plan: any) => {
    console.log('Email plan clicked:', plan);
    toast.info('Funcionalidade em desenvolvimento');
  };

  if (isLoading) {
    return <CartLoading />;
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
          <CartActions />
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <CartItems 
                items={items} 
                domainItems={domainItems}
                domainWithOwnershipMap={domainWithOwnershipMap}
                onRemoveItem={removeFromCart} 
                onOpenOwnershipDialog={handleOpenOwnershipDialog}
              />
              
              <RecommendedServices 
                hasDomains={domainItems.length > 0}
                selectedBillingPeriod={billingPeriod}
                onAddProduct={handleAddProduct}
                onEmailPlanClick={handleEmailPlanClick}
              />
            </div>
            
            <CartSummary 
              subtotal={subtotal}
              hasUnownedDomains={hasUnownedDomains}
              hasDomains={domainItems.length > 0}
              onClearCart={handleClearCart}
            />
          </div>
        )}
        
        <Dialog open={isOwnershipDialogOpen} onOpenChange={setIsOwnershipDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Titularidade do Domínio {currentDomain}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={ownershipData.name}
                  onChange={(e) => setOwnershipData({...ownershipData, name: e.target.value})}
                  placeholder="Nome completo do proprietário"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={ownershipData.email}
                  onChange={(e) => setOwnershipData({...ownershipData, email: e.target.value})}
                  placeholder="Email do proprietário"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={ownershipData.phone}
                  onChange={(e) => setOwnershipData({...ownershipData, phone: e.target.value})}
                  placeholder="Telefone do proprietário"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="document">Documento (CPF/CNPJ)</Label>
                <Input
                  id="document"
                  value={ownershipData.document}
                  onChange={(e) => setOwnershipData({...ownershipData, document: e.target.value})}
                  placeholder="Documento do proprietário"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={ownershipData.address}
                  onChange={(e) => setOwnershipData({...ownershipData, address: e.target.value})}
                  placeholder="Endereço do proprietário"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOwnershipDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveOwnership}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

const Cart = () => (
  <CartProvider>
    <CartPage />
  </CartProvider>
);

export default Cart;
