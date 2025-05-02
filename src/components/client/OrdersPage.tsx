
import React, { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FileText, Eye, Download } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { useInvoices } from '@/hooks/useInvoices';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order } from '@/types/client';

const OrdersPage = () => {
  const { orders, isLoading, fetchOrders } = useOrders();
  const { downloadInvoice } = useInvoices();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  
  // Check if we have an order ID in the query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orderId = params.get('order');
    
    if (orderId && orders.length > 0) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
        setShowDetails(true);
      }
    }
  }, [orders, location.search]);

  // Handle invoice download
  const handleDownloadInvoice = (invoiceId: string) => {
    if (!invoiceId) {
      toast.error('Nenhuma fatura disponível para este pedido');
      return;
    }
    
    try {
      downloadInvoice(invoiceId);
    } catch (error: any) {
      toast.error('Erro ao baixar fatura: ' + error.message);
    }
  };

  // Format date 
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment status badge color
  const getPaymentStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meus Pedidos</h1>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : orders.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>
              Visualize todos os seus pedidos e faturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>{formatPrice(order.total_amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(order.status)}`}>
                        {order.status === 'pending' ? 'Pendente' : 
                         order.status === 'processing' ? 'Processando' :
                         order.status === 'completed' ? 'Completo' :
                         order.status === 'cancelled' ? 'Cancelado' : order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusBadge(order.payment_status)}`}>
                        {order.payment_status === 'pending' ? 'Pendente' :
                         order.payment_status === 'paid' ? 'Pago' :
                         order.payment_status === 'cancelled' ? 'Cancelado' : order.payment_status}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setSelectedOrder(order);
                        setShowDetails(true);
                      }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {order.invoice && (
                        <Button variant="ghost" size="icon" onClick={() => handleDownloadInvoice(order.invoice?.id || '')}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium">Nenhum pedido encontrado</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Você ainda não realizou nenhum pedido em nossa loja.
              </p>
              <Button className="mt-4" onClick={() => navigate('/')}>
                Explorar produtos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order details dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Número do pedido</p>
                  <p>{selectedOrder.order_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Data</p>
                  <p>{formatDate(selectedOrder.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status === 'pending' ? 'Pendente' : 
                     selectedOrder.status === 'processing' ? 'Processando' :
                     selectedOrder.status === 'completed' ? 'Completo' :
                     selectedOrder.status === 'cancelled' ? 'Cancelado' : selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pagamento</p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentStatusBadge(selectedOrder.payment_status)}`}>
                    {selectedOrder.payment_status === 'pending' ? 'Pendente' :
                     selectedOrder.payment_status === 'paid' ? 'Pago' :
                     selectedOrder.payment_status === 'cancelled' ? 'Cancelado' : selectedOrder.payment_status}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Itens do pedido</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold">{formatPrice(selectedOrder.total_amount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              {selectedOrder.client_details && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Informações do cliente</h4>
                  <div className="bg-muted p-3 rounded">
                    <p><span className="font-medium">Nome:</span> {selectedOrder.client_details.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.client_details.email}</p>
                    <p><span className="font-medium">Telefone:</span> {selectedOrder.client_details.phone}</p>
                    <p><span className="font-medium">Endereço:</span> {selectedOrder.client_details.address}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {selectedOrder.invoice && (
                  <Button variant="outline" onClick={() => handleDownloadInvoice(selectedOrder.invoice?.id || '')}>
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Fatura
                  </Button>
                )}
                <Button variant="default" onClick={() => setShowDetails(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
