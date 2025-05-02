
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ClientInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  profileLoaded: boolean;
}

const ClientInfoSection = ({ formData, profileLoaded }: ClientInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Pessoais</CardTitle>
        <CardDescription>Atualize seus dados pessoais e informações de contato.</CardDescription>
      </CardHeader>
      <CardContent>
        {profileLoaded ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" defaultValue={formData.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={formData.email} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" defaultValue={formData.phone} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" defaultValue={formData.address} readOnly />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">Carregando informações do usuário...</div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientInfoSection;
