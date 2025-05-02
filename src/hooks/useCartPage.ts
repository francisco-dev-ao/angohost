
import { useState, useEffect } from 'react';
import { useCart, CartItem } from '@/contexts/CartContext';
import { emailPlans } from '@/config/emailPlans';
import { DomainOwnershipData } from '@/types/cart';

export const useCartPage = () => {
  const { items, removeFromCart, updateItemPrice, addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBillingPeriod, setSelectedBillingPeriod] = useState('1');
  const [domainWithOwnershipMap, setDomainWithOwnershipMap] = useState<Record<string, DomainOwnershipData | null>>({});
  const [currentDomainForOwnership, setCurrentDomainForOwnership] = useState<string | null>(null);
  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);
  const [selectedEmailPlan, setSelectedEmailPlan] = useState<any | null>(null);

  useEffect(() => {
    // Initialize domain ownership map
    const map: Record<string, DomainOwnershipData | null> = {};
    items
      .filter(item => item.type === 'domain')
      .forEach(item => {
        if (item.domain) {
          map[item.domain] = item.ownershipData || null;
        }
      });
    setDomainWithOwnershipMap(map);
    setIsLoading(false);
  }, [items]);

  const domainItems = items.filter(item => item.type === 'domain');
  const allDomainsHaveOwnership = domainItems.length === 0 || 
    domainItems.every(item => item.ownershipData || item.contactProfileId);

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleOpenOwnershipDialog = (domain: string) => {
    setCurrentDomainForOwnership(domain);
    setIsOwnershipDialogOpen(true);
  };

  const handleCloseOwnershipDialog = () => {
    setIsOwnershipDialogOpen(false);
    setCurrentDomainForOwnership(null);
  };

  const handleOwnershipSubmit = (domain: string, data: DomainOwnershipData) => {
    // Update local state
    const updatedMap = { ...domainWithOwnershipMap };
    updatedMap[domain] = data;
    setDomainWithOwnershipMap(updatedMap);
    
    // Close dialog
    handleCloseOwnershipDialog();
  };

  const handleAddProduct = (product: any, years: number = 1) => {
    addToCart({
      id: `${product.title}-${Date.now()}`,
      title: product.title,
      description: product.description,
      quantity: 1,
      price: product.basePrice * years,
      basePrice: product.basePrice,
      years
    });
  };

  const handleEmailPlanClick = (plan: any) => {
    setSelectedEmailPlan(plan);
  };

  const handleConfirmEmailPlan = (config: { 
    userCount: number; 
    period: string;
    domainOption?: string;
    selectedDomain?: string;
    contactProfileId?: string;
  }) => {
    if (!selectedEmailPlan) return;

    const years = parseInt(config.period);

    // Add email product to cart
    const emailItem: CartItem = {
      id: `${selectedEmailPlan.title}-${Date.now()}`,
      title: `${selectedEmailPlan.title} (${config.userCount} usuários por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: config.userCount,
      price: selectedEmailPlan.basePrice * config.userCount * years,
      basePrice: selectedEmailPlan.basePrice,
      type: "email",
    };
    
    addToCart(emailItem);
    
    // If user selected to register a new domain, add domain item
    if (config.domainOption === 'new' && config.selectedDomain) {
      const domainItem: CartItem = {
        id: `domain-${config.selectedDomain}-${Date.now()}`,
        title: `Domínio: ${config.selectedDomain}`,
        quantity: 1,
        price: 2000, // Default domain price
        basePrice: 2000,
        type: "domain",
        domain: config.selectedDomain,
        contactProfileId: config.contactProfileId
      };
      
      addToCart(domainItem);
    }
    
    // Clear selection
    setSelectedEmailPlan(null);
  };

  // Recalculate prices when billing period changes
  const handleRecalculatePrices = (period: string) => {
    const years = parseInt(period);
    items.forEach(item => {
      // Exclude domains from period calculation
      if (item.type !== 'domain') {
        const newPrice = item.basePrice * years;
        updateItemPrice(item.id, newPrice);
      }
    });
  };

  return {
    items,
    isLoading,
    domainItems,
    selectedBillingPeriod,
    setSelectedBillingPeriod,
    domainWithOwnershipMap,
    currentDomainForOwnership,
    isOwnershipDialogOpen,
    selectedEmailPlan,
    allDomainsHaveOwnership,
    handleRemoveItem,
    handleOpenOwnershipDialog,
    handleCloseOwnershipDialog,
    handleOwnershipSubmit,
    handleAddProduct,
    handleEmailPlanClick,
    handleConfirmEmailPlan,
    handleRecalculatePrices,
  };
};
