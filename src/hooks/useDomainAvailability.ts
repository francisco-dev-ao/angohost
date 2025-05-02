
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DomainAvailabilityResult {
  available: boolean;
  domain: string;
  price?: number;
}

export const useDomainAvailability = () => {
  const [availability, setAvailability] = useState<DomainAvailabilityResult | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (domain: string) => {
    try {
      setLoading(true);
      
      // Basic validation
      if (!domain || domain.trim() === '') {
        throw new Error('Domain name is required');
      }
      
      // Check if domain has extension, if not, add default .ao
      const domainWithExtension = domain.includes('.') ? domain : `${domain}.ao`;
      
      // Simulate API call to check domain availability
      // In a real scenario, this would call a domain registrar API
      const { data: extensionsData } = await supabase
        .from('domain_extensions')
        .select('*')
        .eq('is_active', true);
      
      // Simulate domain check (in production, this should be an actual API call)
      // For demo purposes, we'll make domains with 'taken' in them unavailable
      const isAvailable = !domainWithExtension.includes('taken');
      
      // Find extension price
      const extension = domainWithExtension.substring(domainWithExtension.lastIndexOf('.'));
      const extensionData = extensionsData?.find(ext => ext.extension === extension) || 
                          extensionsData?.find(ext => ext.extension === '.ao');
      
      const result: DomainAvailabilityResult = {
        available: isAvailable,
        domain: domainWithExtension,
        price: extensionData?.price || 2000 // Default price if not found
      };
      
      setAvailability(result);
      return result;
      
    } catch (error: any) {
      toast.error(`Error checking domain: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    checkAvailability,
    availability,
    loading,
    resetAvailability: () => setAvailability(null)
  };
};
