
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useClientDashboard } from '@/hooks/useClientDashboard';
import { Domain, Service } from '@/types/client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateShort } from '@/utils/formatters';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { 
    services, 
    domains, 
    loading, 
    fetchDashboardData,
    // Make sure these values exist or provide default values
    activeServices = [],
    pendingInvoices = [],
    openTickets = [],
    notifications = [],
    domains_list = domains
  } = useClientDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderDomainsSection = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      );
    }

    if (!domains_list || domains_list.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Você ainda não possui domínios registrados.</p>
          <Button onClick={() => navigate('/domains')}>
            Registrar Domínio
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {domains_list.slice(0, 3).map((domain: Domain) => (
          <div key={domain.id} className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <p className="font-medium">{domain.name}</p>
              <p className="text-sm text-muted-foreground">
                Expira em: {formatDateShort(domain.expiry_date)}
              </p>
            </div>
            <Badge variant={domain.status === 'active' ? 'outline' : 'secondary'}>
              {domain.status === 'active' ? 'Ativo' : domain.status}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  const renderServicesSection = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      );
    }

    if (services.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Você não possui serviços ativos.</p>
          <Button onClick={() => navigate('/cpanel-hosting')}>
            Contratar Hospedagem
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {services.slice(0, 3).map((service: Service) => (
          <div key={service.id} className="flex items-center justify-between p-3 border rounded-md">
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                {service.type} - {formatDateShort(service.renewal_date)}
              </p>
            </div>
            <Badge variant={service.status === 'active' ? 'outline' : 'secondary'}>
              {service.status === 'active' ? 'Ativo' : service.status}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Serviços Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeServices ? activeServices.length : 0}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/client/services')}>
              Ver todos
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices ? pendingInvoices.length : 0}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/client/invoices')}>
              Ver todas
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tickets Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets ? openTickets.length : 0}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/client/support')}>
              Ver todos
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Notificações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications ? notifications.length : 0}</div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate('/client/notifications')}>
              Ver todas
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Meus Domínios</CardTitle>
            <CardDescription>
              Gerencie seus domínios registrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderDomainsSection()}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/client/domains')}>
              Ver todos os domínios
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meus Serviços</CardTitle>
            <CardDescription>
              Gerencie suas hospedagens e email
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderServicesSection()}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => navigate('/client/services')}>
              Ver todos os serviços
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
