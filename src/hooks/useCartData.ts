
import { useState, useEffect } from 'react';
import { CartItem } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

export const useCartData = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        // If user is logged in, try to load cart from database
        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, cart_items')
            .eq('id', user.id)
            .single();
            
          if (error) {
            // If there's an error but not "no rows returned", throw it
            if (error.code !== 'PGRST116') {
              throw error;
            }
            
            // No profile found, use local storage
            const localCart = localStorage.getItem('cart');
            if (localCart) {
              setItems(JSON.parse(localCart));
            }
          } else if (data && data.cart_items) {
            // Use cart items from profile - properly typed
            setItems((data.cart_items as unknown) as CartItem[]);
          } else {
            // No cart items in profile, try local storage
            const localCart = localStorage.getItem('cart');
            if (localCart) {
              setItems(JSON.parse(localCart));
            }
          }
        } else {
          // If not logged in, load from local storage
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            setItems(JSON.parse(localCart));
          }
        }
      } catch (err: any) {
        console.error('Error loading cart:', err);
        setError(err);
        
        // Try local storage as fallback
        const localCart = localStorage.getItem('cart');
        if (localCart) {
          setItems(JSON.parse(localCart));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [user]);
  
  const saveCart = async (newItems: CartItem[]) => {
    // Always save to local storage
    localStorage.setItem('cart', JSON.stringify(newItems));
    
    // If user is logged in, also save to database in profiles table
    if (user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            cart_items: newItems as any, // Type cast to satisfy TypeScript
            updated_at: new Date().toISOString() // Convert Date to ISO string
          })
          .eq('id', user.id);
          
        if (error) throw error;
      } catch (err) {
        console.error('Error saving cart to database:', err);
        // Continue even if DB save fails, as we have local storage backup
      }
    }
  };

  const addToCart = (item: CartItem) => {
    // Check if item already exists in cart
    const existingItemIndex = items.findIndex(i => i.id === item.id);
    
    let newItems: CartItem[];
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      newItems = [...items];
      newItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      newItems = [...items, item];
    }
    
    setItems(newItems);
    saveCart(newItems);
  };
  
  const updateItemPrice = (itemId: string, newPrice: number) => {
    const itemIndex = items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return;
    
    const newItems = [...items];
    newItems[itemIndex] = {...newItems[itemIndex], price: newPrice};
    
    setItems(newItems);
    saveCart(newItems);
  };

  const removeFromCart = (itemId: string) => {
    const newItems = items.filter(item => item.id !== itemId);
    setItems(newItems);
    saveCart(newItems);
  };

  const clearCart = () => {
    setItems([]);
    saveCart([]);
  };

  return { 
    items, 
    isLoading, 
    error, 
    addToCart, 
    removeFromCart, 
    clearCart,
    updateItemPrice
  };
};
