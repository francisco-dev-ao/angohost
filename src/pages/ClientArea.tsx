
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { toast } from "sonner";
import OrdersPage from "@/components/client/OrdersPage";
import { motion } from "framer-motion";

const ClientArea = () => {
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();

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
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <OrdersPage />
    </motion.div>
  );
};

export default ClientArea;
