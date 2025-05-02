
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { Badge } from '@/components/ui/badge';
import { Domain, Service } from '@/types/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/formatters';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const {
    dashboardData,
    isLoading,
    error
  } = useClientDashboard();

  useEffect(() => {
    if (dashboardData) {
      console.log('Dashboard data loaded:', dashboardData);
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao carregar dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ocorreu um erro ao carregar os dados do dashboard. Por favor, tente novamente mais tarde.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Tentar novamente</Button>
        </CardContent>
      </Card>
    );
  }
  
  // Make sure we have a valid array for domains, services, invoices, and orders
  const domains = Array.isArray(dashboardData?.domains) ? dashboardData.domains : [];
  const services = Array.isArray(dashboardData?.services) ? dashboardData.services : [];
  const invoices = Array.isArray(dashboardData?.invoices) ? dashboardData.invoices : [];
  const orders = Array.isArray(dashboardData?.orders) ? dashboardData.orders : [];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Domínios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {domains.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de domínios registrados
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Serviços
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {services.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de serviços ativos
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Faturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invoices.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Faturas emitidas
            </p>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de pedidos
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Meus Domínios</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/client/domains')}>
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            {domains.length > 0 ? (
              <div className="space-y-2">
                {domains.slice(0, 5).map((domain) => (
                  <div key={domain.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{domain.domain}</p>
                      <p className="text-sm text-muted-foreground">Expira em: {formatDate(domain.expires_at || '')}</p>
                    </div>
                    <Badge variant={domain.status === 'active' ? 'default' : domain.status === 'pending' ? 'outline' : 'destructive'}>
                      {domain.status === 'active' ? 'Ativo' : domain.status === 'pending' ? 'Pendente' : 'Expirado'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhum domínio registrado</p>
                <Button className="mt-2" onClick={() => navigate('/domains')}>Registrar domínio</Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Meus Serviços</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/client/services')}>
              Ver todos
            </Button>
          </CardHeader>
          <CardContent>
            {services.length > 0 ? (
              <div className="space-y-2">
                {services.slice(0, 5).map((service) => (
                  <div key={service.id} className="flex justify-between items-center p-2 border-b">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.service_type || 'Serviço'} - {formatDate(service.created_at || '')}
                      </p>
                    </div>
                    <Badge variant={service.status === 'active' ? 'default' : service.status === 'pending' ? 'outline' : 'destructive'}>
                      {service.status === 'active' ? 'Ativo' : service.status === 'pending' ? 'Pendente' : 'Suspenso'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Nenhum serviço contratado</p>
                <Button className="mt-2" onClick={() => navigate('/')}>Ver serviços disponíveis</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
