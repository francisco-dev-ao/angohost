
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface ClientStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    phone: string;
    address: string;
  }>>;
  nextStep: () => void;
  completedSteps: Record<string, boolean>;
}

const ClientStep = ({
  formData,
  setFormData,
  nextStep,
  completedSteps
}: ClientStepProps) => {
  const { user } = useSupabaseAuth();
  
  if (!user) {
    return (
      <>
        <CardTitle className="mb-4">Dados do Cliente</CardTitle>
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Faça login para continuar</h3>
          <p className="text-muted-foreground mb-4">
            É necessário estar autenticado para finalizar sua compra
          </p>
          <Button 
            onClick={() => window.location.href = '/register'}
            className="mb-2"
          >
            Fazer login
          </Button>
        </div>
      </>
    );
  }
  
  return (
    <>
      <CardTitle className="mb-4">Dados do Cliente</CardTitle>
      <div className="bg-muted/30 p-4 rounded-md mb-6 flex items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{user.user_metadata?.full_name || formData.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email || formData.email}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              readOnly
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          type="button" 
          onClick={nextStep} 
          disabled={!formData.name || !formData.email || !formData.phone || !formData.address}
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default ClientStep;
