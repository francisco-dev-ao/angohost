
import React, { useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
  
  // Populate form data from user profile when available
  useEffect(() => {
    if (user) {
      // Set form data from user profile
      setFormData({
        name: user.user_metadata?.full_name || formData.name || '',
        email: user.email || formData.email || '',
        phone: formData.phone || '',
        address: formData.address || ''
      });
    }
  }, [user]);
  
  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    nextStep();
  };
  
  return (
    <>
      <CardTitle className="mb-4">Dados do Cliente</CardTitle>
      {user ? (
        <>
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
                  readOnly={!!user.user_metadata?.full_name}
                  className={user.user_metadata?.full_name ? "bg-muted/50" : ""}
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
              onClick={handleSubmit}
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium mb-2">Faça login para continuar</h3>
          <p className="text-muted-foreground mb-4">
            É necessário estar autenticado para finalizar sua compra
          </p>
        </div>
      )}
    </>
  );
};

export default ClientStep;
