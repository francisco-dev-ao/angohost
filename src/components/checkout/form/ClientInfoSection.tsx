
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ClientInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  profileLoaded: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ClientInfoSection = ({ formData, profileLoaded, onChange }: ClientInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados pessoais</CardTitle>
        <CardDescription>Informações para faturamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              disabled={true}
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              disabled={true}
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              disabled={profileLoaded}
              className={profileLoaded ? "bg-muted" : ""}
            />
            {profileLoaded && formData.phone && (
              <p className="text-xs text-muted-foreground">
                Para alterar, contate o suporte
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={onChange}
              disabled={profileLoaded}
              className={profileLoaded ? "bg-muted" : ""}
            />
            {profileLoaded && formData.address && (
              <p className="text-xs text-muted-foreground">
                Para alterar, contate o suporte
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfoSection;
