
import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartData } from '@/hooks/useCartData';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { CartItem as CartItemType, DomainOwnershipData } from '@/types/cart';

// Use the CartItem type from types/cart.ts instead of redefining it here
export type { CartItemType as CartItem };

interface CartContextType {
  items: CartItemType[];
  addToCart: (item: CartItemType) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateItemPrice: (itemId: string, newPrice: number) => void;
  isLoading?: boolean;
  error?: Error | null;
  isAuthenticated: boolean;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useSupabaseAuth();
  const { items, isLoading, error, addToCart, removeFromCart, clearCart, updateItemPrice } = useCartData();
  
  // Calculate total from items
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        updateItemPrice,
        isLoading,
        error,
        isAuthenticated: !!user,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
