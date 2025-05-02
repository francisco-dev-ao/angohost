import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { Domain } from '@/types/client';

export const useClientDomains = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSupabaseAuth();

  const fetchDomains = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('client_domains')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the database status values to the expected Domain status values
      const formattedDomains: Domain[] = (data || []).map(domain => ({
        id: domain.id,
        domain_name: domain.domain_name,
        user_id: domain.user_id,
        // Map any unexpected status values to one of the allowed statuses
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
      
      setDomains(formattedDomains);
    } catch (error: any) {
      console.error('Error fetching domains:', error);
      toast.error('Erro ao carregar domínios');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map any status to the allowed Domain status values
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

  const toggleAutoRenew = async (domainId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('client_domains')
        .update({ auto_renew: !currentValue })
        .eq('id', domainId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Update local state
      setDomains(domains.map(domain => {
        if (domain.id === domainId) {
          return { ...domain, auto_renew: !currentValue };
        }
        return domain;
      }));

      toast.success(`Renovação automática ${!currentValue ? 'ativada' : 'desativada'}`);
    } catch (error: any) {
      console.error('Error toggling auto renew:', error);
      toast.error('Erro ao atualizar configuração de renovação automática');
    }
  };

  const toggleWhoisPrivacy = async (domainId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('client_domains')
        .update({ whois_privacy: !currentValue })
        .eq('id', domainId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Update local state
      setDomains(domains.map(domain => {
        if (domain.id === domainId) {
          return { ...domain, whois_privacy: !currentValue };
        }
        return domain;
      }));

      toast.success(`Proteção WHOIS ${!currentValue ? 'ativada' : 'desativada'}`);
    } catch (error: any) {
      console.error('Error toggling WHOIS privacy:', error);
      toast.error('Erro ao atualizar configuração de proteção WHOIS');
    }
  };

  const toggleLock = async (domainId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('client_domains')
        .update({ is_locked: !currentValue })
        .eq('id', domainId)
        .eq('user_id', user?.id);

      if (error) throw error;

      // Update local state
      setDomains(domains.map(domain => {
        if (domain.id === domainId) {
          return { ...domain, is_locked: !currentValue };
        }
        return domain;
      }));

      toast.success(`Domínio ${!currentValue ? 'bloqueado' : 'desbloqueado'} para transferência`);
    } catch (error: any) {
      console.error('Error toggling domain lock:', error);
      toast.error('Erro ao atualizar configuração de bloqueio');
    }
  };

  useEffect(() => {
    if (user) {
      fetchDomains();
    }
  }, [user]);

  return { domains, loading, fetchDomains, toggleAutoRenew, toggleWhoisPrivacy, toggleLock };
};
