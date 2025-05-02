
import { supabase } from '@/integrations/supabase/client';

export const useAdminRealtimeListeners = () => {
  const setupRealtimeListeners = (onDataChange: () => void) => {
    const ordersChannel = supabase
      .channel('admin-dashboard-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          console.log('Orders updated in real-time');
          onDataChange();
        }
      )
      .subscribe();

    const invoicesChannel = supabase
      .channel('admin-dashboard-invoices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices'
        },
        () => {
          console.log('Invoices updated in real-time');
          onDataChange();
        }
      )
      .subscribe();

    const paymentMethodsChannel = supabase
      .channel('admin-dashboard-payment-methods')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_methods'
        },
        () => {
          console.log('Payment methods updated in real-time');
          onDataChange();
        }
      )
      .subscribe();
      
    const usersChannel = supabase
      .channel('admin-dashboard-users')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('User profiles updated in real-time');
          onDataChange();
        }
      )
      .subscribe();

    const settingsChannel = supabase
      .channel('admin-dashboard-settings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'admin_settings'
        },
        () => {
          console.log('Admin settings updated in real-time');
          onDataChange();
        }
      )
      .subscribe();
      
    return { 
      ordersChannel, 
      invoicesChannel, 
      paymentMethodsChannel,
      usersChannel,
      settingsChannel
    };
  };

  return { setupRealtimeListeners };
};
