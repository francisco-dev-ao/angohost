
import { useState, useEffect } from 'react';
import { executeOperation } from '@/utils/database';
import { ServicePlan } from '@/hooks/useServicePlans';

export const useServicePlansDb = (serviceType?: string) => {
  const [plans, setPlans] = useState<ServicePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create filter for the operation
        const filter: Record<string, any> = {
          select: '*',
          orderBy: 'price_monthly'
        };
        
        // Add service_type filter if provided
        if (serviceType) {
          filter.eq = { service_type: serviceType };
        }

        // Fetch plans using our database operation
        const result = await executeOperation('service_plans', 'select', filter);

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch plans');
        }
        
        // Transform the features from Json to Record<string, any>
        const transformedData = (result.data || []).map(item => ({
          ...item,
          features: typeof item.features === 'string' 
            ? JSON.parse(item.features) 
            : item.features || {}
        }));
        
        setPlans(transformedData as ServicePlan[]);
      } catch (error: any) {
        console.error('Error fetching service plans:', error);
        setError(error.message);
        // Set empty plans to prevent UI errors
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [serviceType]);

  return { plans, loading, error };
};
