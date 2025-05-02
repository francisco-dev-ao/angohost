
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CircleDollarSign, Package, Receipt, Users } from "lucide-react";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from '@/utils/formatters';

const ClientDashboard = () => {
  const { stats, isLoading, error } = useClientDashboard();

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Erro ao carregar dados do dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard 
          title="Serviços Ativos" 
          value={isLoading ? undefined : stats.activeServices}
          icon={<Package className="text-green-500" />}
          description="Serviços em execução"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Domínios Ativos" 
          value={isLoading ? undefined : stats.activeDomains}
          icon={<Users className="text-blue-500" />}
          description="Domínios registrados"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Faturas Pendentes" 
          value={isLoading ? undefined : stats.pendingInvoices}
          icon={<Receipt className="text-amber-500" />}
          description="Aguardando pagamento"
          isLoading={isLoading}
        />
        
        <StatsCard 
          title="Total Investido" 
          value={isLoading ? undefined : formatPrice(stats.totalSpent)}
          icon={<CircleDollarSign className="text-[#673de6]" />}
          description="Valor total investido"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value?: string | number;
  icon: React.ReactNode;
  description: string;
  isLoading: boolean;
}

const StatsCard = ({ title, value, icon, description, isLoading }: StatsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-5 w-5">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-28" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardFooter>
    </Card>
  );
};

export default ClientDashboard;
