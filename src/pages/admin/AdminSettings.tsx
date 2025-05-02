
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsForm } from '@/components/admin/settings/GeneralSettingsForm';
import { CurrencySettingsForm } from '@/components/admin/settings/CurrencySettingsForm';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AdminLayout>
      <motion.div 
        className="p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="currency">Moeda</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsForm 
              settings={{
                siteName: "AngoHost",
                siteUrl: "https://angohost.ao",
                adminEmail: "admin@angohost.ao",
                logoUrl: "/logo.png",
                enableMaintenance: false
              }}
              onSettingsChange={() => {}}
              onSave={async () => true}
            />
          </TabsContent>

          <TabsContent value="currency" className="space-y-6">
            <CurrencySettingsForm />
          </TabsContent>
          
          <TabsContent value="email">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Configurações de email serão implementadas em breve.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Configurações de notificações serão implementadas em breve.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminSettings;
