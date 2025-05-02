
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { executeQuery } from "@/utils/database";

export interface DashboardStats {
  activeServices: number;
  activeDomains: number;
  pendingInvoices: number;
  totalSpent: number | string;
}

export const useClientDashboard = () => {
  const { user } = useSupabaseAuth();
  const [stats, setStats] = useState<DashboardStats>({
    activeServices: 0,
    activeDomains: 0,
    pendingInvoices: 0,
    totalSpent: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get active services count
        const servicesResult = await executeQuery(
          "SELECT COUNT(*) FROM client_services WHERE user_id = $1 AND status = 'active'",
          [user.id]
        );

        // Get active domains count
        const domainsResult = await executeQuery(
          "SELECT COUNT(*) FROM client_domains WHERE user_id = $1 AND status = 'active'",
          [user.id]
        );

        // Get pending invoices count
        const invoicesResult = await executeQuery(
          "SELECT COUNT(*) FROM invoices WHERE user_id = $1 AND status = 'pending'",
          [user.id]
        );

        // Get total spent
        const spentResult = await executeQuery(
          "SELECT SUM(amount) FROM invoices WHERE user_id = $1 AND status = 'paid'",
          [user.id]
        );

        if (
          servicesResult.success &&
          domainsResult.success &&
          invoicesResult.success &&
          spentResult.success
        ) {
          setStats({
            activeServices: parseInt(servicesResult.data?.[0]?.count || '0'),
            activeDomains: parseInt(domainsResult.data?.[0]?.count || '0'),
            pendingInvoices: parseInt(invoicesResult.data?.[0]?.count || '0'),
            totalSpent: parseInt(spentResult.data?.[0]?.sum || '0'),
          });
        } else {
          throw new Error("Falha ao buscar dados do dashboard");
        }
      } catch (err: any) {
        console.error("Erro ao buscar dados do dashboard:", err);
        setError(err.message || "Erro desconhecido");
        
        // Set fallback data in case of error
        setStats({
          activeServices: 0,
          activeDomains: 0,
          pendingInvoices: 0,
          totalSpent: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return { stats, isLoading, error };
};
