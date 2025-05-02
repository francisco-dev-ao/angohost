
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInvoices } from '@/hooks/useInvoices';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { FileText, RefreshCcw, Filter, Download, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/formatters';
import InvoiceViewDialog from './InvoiceViewDialog';

const InvoicesPage = () => {
  const { invoices, isLoading, downloadInvoice } = useInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'cancelled': 
      case 'canceled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    downloadInvoice(invoiceId);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7" />
          Minhas Faturas
        </h1>
        <Button size="sm" variant="outline" className="flex items-center gap-1" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4" />
          Atualizar
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xl">Histórico de Faturas</CardTitle>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
              <Filter className="h-3 w-3" /> Filtrar
            </Button>
          </CardHeader>
          <CardContent>
            {invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número da Fatura</TableHead>
                      <TableHead>Data de Emissão</TableHead>
                      <TableHead>Data de Vencimento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <motion.tr 
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(new Date(invoice.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                            {invoice.status === 'paid' ? 'Pago' :
                             invoice.status === 'pending' ? 'Pendente' :
                             invoice.status === 'overdue' ? 'Vencido' :
                             invoice.status === 'cancelled' || invoice.status === 'canceled' ? 'Cancelado' :
                             invoice.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(invoice.amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8" 
                              onClick={() => handleViewInvoice(invoice)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8"
                              onClick={() => handleDownloadInvoice(invoice.id)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium">Nenhuma fatura encontrada</p>
                  <p className="text-muted-foreground">Suas faturas aparecerão aqui quando você fizer compras em nossa loja.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {selectedInvoice && (
        <InvoiceViewDialog 
          invoice={selectedInvoice} 
          isOpen={viewDialogOpen} 
          onOpenChange={setViewDialogOpen} 
        />
      )}
    </div>
  );
};

export default InvoicesPage;
