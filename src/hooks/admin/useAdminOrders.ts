
import { useState } from 'react';
import { executeQuery } from '@/utils/database';
import { mapSupabaseOrderToOrder } from '@/utils/adminMappers';
import { Order } from '@/types/admin';

export const useAdminOrders = () => {
  const [loading, setLoading] = useState(true);

  const fetchRecentOrders = async (): Promise<Order[]> => {
    try {
      const { success, data, error } = await executeQuery(
        'SELECT * FROM orders ORDER BY created_at DESC LIMIT 5'
      );
        
      if (!success) throw new Error(error);
      
      return data ? 
        data.map((order: any) => mapSupabaseOrderToOrder(order)) 
        : [];
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  };
  
  const fetchOrderCounts = async () => {
    try {
      const pendingResult = await executeQuery(
        'SELECT COUNT(*) as count FROM orders WHERE status = $1',
        ['pending']
      );
      
      if (!pendingResult.success) throw new Error(pendingResult.error);
      
      const activeResult = await executeQuery(
        'SELECT COUNT(*) as count FROM orders WHERE status = $1',
        ['processing']
      );
      
      if (!activeResult.success) throw new Error(activeResult.error);
      
      const completedResult = await executeQuery(
        'SELECT COUNT(*) as count FROM orders WHERE status = $1',
        ['completed']
      );
      
      if (!completedResult.success) throw new Error(completedResult.error);
      
      return {
        pendingOrders: parseInt(pendingResult.data[0]?.count || '0'),
        activeOrders: parseInt(activeResult.data[0]?.count || '0'),
        completedOrders: parseInt(completedResult.data[0]?.count || '0')
      };
    } catch (error) {
      console.error('Error fetching order counts:', error);
      return { pendingOrders: 0, activeOrders: 0, completedOrders: 0 };
    }
  };

  return { fetchRecentOrders, fetchOrderCounts };
};
