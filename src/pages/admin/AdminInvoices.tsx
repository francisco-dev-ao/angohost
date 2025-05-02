
import React, { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminInvoices } from "@/hooks/admin/useAdminInvoices";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import InvoiceHeader from "@/components/admin/invoices/InvoiceHeader";
import InvoiceSearch from "@/components/admin/invoices/InvoiceSearch";
import InvoicesTable from "@/components/admin/invoices/InvoicesTable";

const AdminInvoices = () => {
  const { invoices, isLoading, deleteInvoice } = useAdminInvoices();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId);
    } catch (error: any) {
      toast.error('Erro ao excluir fatura: ' + error.message);
    }
  };

  const handleExportReport = () => {
    // Function to export invoices report
    toast.info("Exportação de relatório em desenvolvimento");
  };

  const handleViewInvoice = (id: string) => {
    // Function to view invoice details
    console.log(`View invoice ${id}`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <InvoiceHeader onExport={handleExportReport} />

        <Card>
          <CardHeader>
            <CardTitle>Lista de Faturas</CardTitle>
            <CardDescription>
              Total de {filteredInvoices.length} faturas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <InvoiceSearch 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-5 w-2/5" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <InvoicesTable 
                invoices={filteredInvoices} 
                onDeleteInvoice={handleDeleteInvoice}
                onViewInvoice={handleViewInvoice}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInvoices;
