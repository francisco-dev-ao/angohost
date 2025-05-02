
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { executeQuery } from '@/utils/database';
import { toast } from 'sonner';

export const useCheckoutProcess = () => {
  const { items, total } = useCart();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [authVisible, setAuthVisible] = useState(false);

  // Calculated values for OrderSummary
  const subtotal = total;
  const discount = 0; // You can implement discount logic if needed

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      navigate('/');
    }
  }, [items, navigate, orderPlaced]);

  const handleAuthComplete = () => {
    setAuthVisible(false);
  };

  const handleSubmitOrder = async (formData: any) => {
    if (!user) {
      setAuthVisible(true);
      return;
    }

    try {
      setLoading(true);
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Create order in database
      const { success, data, error } = await executeQuery(
        `INSERT INTO orders (
          order_number, user_id, items, total_amount, status, 
          payment_method, client_details
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING id`,
        [
          orderNumber,
          user.id,
          JSON.stringify(items),
          total,
          'pending',
          formData.paymentMethod,
          JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address
          })
        ]
      );
      
      if (!success || error) {
        throw new Error(error || 'Falha ao criar pedido');
      }

      // Clear cart and show success message
      setOrderPlaced(true);
      toast.success('Pedido realizado com sucesso!');
      
      // Redirect to order confirmation
      setTimeout(() => {
        navigate(`/client/orders?id=${data[0].id}`);
      }, 2000);
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(`Erro ao finalizar compra: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    total,
    subtotal,
    discount,
    loading,
    orderPlaced,
    authVisible,
    handleAuthComplete,
    handleSubmitOrder
  };
};
