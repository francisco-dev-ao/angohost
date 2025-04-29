
import React from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ClientSidebar from "@/components/client/ClientSidebar";
import { useClientRoutes } from "@/hooks/useClientRoutes";

const ClientArea = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();
  const { currentComponent } = useClientRoutes();

  React.useEffect(() => {
    if (!loading && !user) {
      toast.error('Faça login para acessar a área do cliente');
      navigate('/register');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="container py-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Carregando...</h1>
          <p>Por favor, aguarde enquanto carregamos suas informações.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex min-h-screen w-full">
      <ClientSidebar />
      
      <div className="flex-1">
        <div className="container py-8">
          {currentComponent}
        </div>
      </div>
    </div>
  );
};

export default ClientArea;
