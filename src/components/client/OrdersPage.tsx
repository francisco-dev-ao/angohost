
import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/formatters';
import { Skeleton } from '@/components/ui/skeleton';
import { useInvoices } from '@/hooks/useInvoices';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const OrdersPage = () => {
  const { orders, isLoading } = useOrders();
  const { downloadInvoice } = useInvoices();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

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
      ) : orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhum pedido encontrado</CardTitle>
            <CardDescription>
              Você ainda não realizou nenhum pedido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/domains')}>Fazer um pedido</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pedidos</CardTitle>
            <CardDescription>
              Acompanhe o status dos seus pedidos e acesse as faturas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Lista de pedidos realizados</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº do Pedido</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span>{order.order_number || order.id.substring(0, 8)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(order.created_at), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                    <TableCell>{formatPrice(order.total_amount)}</TableCell>
                    <TableCell>
                      <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                          order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {order.payment_status === 'paid' ? 'Pago' : 
                         order.payment_status === 'pending' ? 'Pendente' : 'Cancelado'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(order.id);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalhes
                        </Button>
                        {order.invoice && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadInvoice(order.invoice.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Fatura
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Detalhes do pedido (simples, pode ser expandido depois) */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedOrder && orders.find(o => o.id === selectedOrder) && (
              <div>
                <h4 className="font-semibold mb-2">Itens:</h4>
                <ul className="space-y-2">
                  {orders.find(o => o.id === selectedOrder)?.items.map((item: any, index: number) => (
                    <li key={index} className="border-b pb-2">
                      <div className="flex justify-between">
                        <span>{item.name || item.title}</span>
                        <span>{formatPrice(item.price)}</span>
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-sm text-muted-foreground">
                          Quantidade: {item.quantity}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(orders.find(o => o.id === selectedOrder)?.total_amount || 0)}</span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;
