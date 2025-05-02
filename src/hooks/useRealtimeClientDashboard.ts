import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Domain, Service } from '@/types/client';
import { toast } from 'sonner';

// Add the AdminSettings type definition
type AdminSettings = {
  currencyFormat: string;
  [key: string]: any;
};

export const useRealtimeClientDashboard = () => {
  const { user } = useSupabaseAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [currencyFormat, setCurrencyFormat] = useState('.');

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      await Promise.all([
        fetchServices(),
        fetchDomains(),
        fetchCurrencyFormat()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrencyFormat = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('settings')
        .eq('id', 'general_settings')
        .single();
      
      if (!error && data && data.settings) {
        // Cast settings to AdminSettings type
        const settings = data.settings as AdminSettings;
        if (settings.currencyFormat) {
          setCurrencyFormat(settings.currencyFormat);
        }
      }
    } catch (error) {
      console.error('Error fetching currency format:', error);
    }
  };

  const fetchServices = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('client_services')
      .select('*')
      .eq('user_id', user.id)
      .limit(10)
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      // Map service_type to match the expected Service type
      const mappedServices: Service[] = data.map(service => ({
        id: service.id,
        name: service.name,
        // Map service_type to one of the allowed values
        service_type: mapServiceType(service.service_type),
        status: mapServiceStatus(service.status),
        created_at: service.created_at,
        updated_at: service.updated_at,
        renewal_date: service.renewal_date,
        price_monthly: service.price_monthly,
        price_yearly: service.price_yearly,
        description: service.description,
        control_panel_url: service.control_panel_url,
        user_id: service.user_id
      }));
      
      setServices(mappedServices);
    }
  };

  const fetchDomains = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('client_domains')
      .select('*')
      .eq('user_id', user.id)
      .limit(10)
      .order('expiry_date', { ascending: true });
      
    if (!error && data) {
      // Map status to match the expected Domain type
      const mappedDomains: Domain[] = data.map(domain => ({
        id: domain.id,
        domain_name: domain.domain_name,
        user_id: domain.user_id,
        status: mapDomainStatus(domain.status),
        registration_date: domain.registration_date,
        expiry_date: domain.expiry_date,
        auto_renew: domain.auto_renew,
        whois_privacy: domain.whois_privacy,
        is_locked: domain.is_locked,
        nameservers: domain.nameservers,
        created_at: domain.created_at,
        updated_at: domain.updated_at
      }));
      
      setDomains(mappedDomains);
    }
  };

  // Helper function to map service_type to the expected Service.service_type values
  const mapServiceType = (type: string): 'hosting' | 'email' | 'ssl' | 'vpn' | 'other' => {
    if (type === 'cpanel_hosting' || type === 'wordpress_hosting' || type === 'vps' || type === 'dedicated_server') {
      return 'hosting';
    } else if (type === 'email' || type === 'exchange') {
      return 'email';
    } else if (type === 'ssl') {
      return 'ssl';
    } else if (type === 'vpn') {
      return 'vpn';
    } else {
      return 'other';
    }
  };

  // Helper function to map status to the expected Domain.status values
  const mapDomainStatus = (status: string): 'pending' | 'active' | 'expired' | 'suspended' => {
    switch(status) {
      case 'active':
        return 'active';
      case 'expired':
        return 'expired';
      case 'suspended':
        return 'suspended';
      case 'pending_transfer':
      case 'pending_registration':
        return 'pending';
      default:
        return 'pending';
    }
  };

  // Helper function to map status to the expected Service.status values
  const mapServiceStatus = (status: string): 'active' | 'pending' | 'suspended' | 'expired' => {
    switch(status) {
      case 'active':
        return 'active';
      case 'expired':
        return 'expired';
      case 'suspended':
        return 'suspended';
      default:
        return 'pending';
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      
      // Set up a real-time subscription to multiple tables
      const channel = supabase
        .channel('client-dashboard-realtime')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'client_services',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('Client services changed, refreshing...');
          fetchServices();
        })
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'client_domains',
          filter: `user_id=eq.${user.id}`
        }, () => {
          console.log('Client domains changed, refreshing...');
          fetchDomains();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'admin_settings',
          filter: `id=eq.general_settings`
        }, () => {
          console.log('Admin settings changed, refreshing currency format...');
          fetchCurrencyFormat();
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return {
    services,
    domains,
    loading,
    currencyFormat,
    fetchDashboardData,
    fetchServices,
    fetchDomains
  };
};
