
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { emailPlans } from "@/config/emailPlans";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

export const useEmailPlans = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useSupabaseAuth();

  const [selectedTab, setSelectedTab] = useState("advanced"); // Default to the popular plan
  const [userCount, setUserCount] = useState(1);
  const [period, setPeriod] = useState("1");
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const getPlanByType = (type: string) => {
    return emailPlans.find(plan => plan.id === type) || emailPlans[0];
  };

  const handleUserCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 1000) {
      setUserCount(value);
    }
  };

  const calculateDiscountedPrice = (basePrice: number) => {
    const years = parseInt(period);
    // Apply 10% discount for multi-year purchases
    const discountMultiplier = years > 1 ? 0.9 : 1;
    return basePrice * userCount * years * discountMultiplier;
  };

  const handlePurchase = (plan: any) => {
    if (!user) {
      toast.error("Faça login para continuar");
      navigate("/register");
      return;
    }
    
    setSelectedPlan(plan);
    setShowDialog(true);
  };

  const handleConfirmPurchase = (config: { 
    userCount: number; 
    period: string; 
    domainOption: string;
    newDomainName?: string;
    selectedExistingDomain?: string;
    contactProfileId?: string;
  }) => {
    if (!selectedPlan) return;

    const years = parseInt(config.period);
    const items = [];
    
    // Apply 10% discount for multi-year purchases
    const discountMultiplier = years > 1 ? 0.9 : 1;
    const finalPrice = selectedPlan.basePrice * config.userCount * years * discountMultiplier;

    // Add email plan to cart
    items.push({
      id: `email-${selectedPlan.id}-${Date.now()}`,
      title: `${selectedPlan.title} (${config.userCount} ${config.userCount === 1 ? 'usuário' : 'usuários'} por ${years} ${years === 1 ? 'ano' : 'anos'})`,
      quantity: config.userCount,
      price: Math.round(finalPrice),
      basePrice: selectedPlan.basePrice,
      renewalPrice: selectedPlan.renewalPrice,
      period: years,
      type: "email"
    });

    // Add domain to cart if registering new one
    if (config.domainOption === "new" && config.newDomainName) {
      items.push({
        id: `domain-${Date.now()}`,
        title: `Domínio: ${config.newDomainName}`,
        quantity: 1,
        price: 2000, // Domain registration fee
        basePrice: 2000,
        type: "domain",
        domain: config.newDomainName,
        contactProfileId: config.contactProfileId
      });
    }

    // Add each item to cart
    items.forEach(item => addToCart(item));

    setShowDialog(false);
    toast.success('Produtos adicionados ao carrinho');
    navigate('/cart');
  };

  return {
    selectedTab,
    setSelectedTab,
    userCount,
    setUserCount,
    period,
    setPeriod,
    selectedPlan,
    setSelectedPlan,
    showDialog,
    setShowDialog,
    getPlanByType,
    handleUserCountChange,
    calculateDiscountedPrice,
    handlePurchase,
    handleConfirmPurchase,
    emailPlans
  };
};
