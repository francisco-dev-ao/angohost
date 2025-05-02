
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "../ui/sidebar";
import { 
  CreditCard, 
  FileText, 
  Home, 
  LogOut, 
  Server, 
  Ticket, 
  User,
  Users,
  Globe,
  ChevronLeft,
  ChevronRight,
  Package,
  Receipt
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const ClientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, setIsOpen } = useSidebar();
  const { user, signOut } = useSupabaseAuth();
  
  // Check if user is administrator
  const isAdmin = 
    user?.user_metadata?.role === 'admin' || 
    user?.email?.endsWith('@admin.com') || 
    user?.email === 'support@angohost.ao';
    
  // Check if user is super admin (support@angohost.ao)
  const isSuperAdmin = user?.email === 'support@angohost.ao';

  const menuItems = [
    {
      title: "Painel",
      href: "/client",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Meu Perfil",
      href: "/client/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Serviços",
      href: "/client/services",
      icon: <Server className="h-5 w-5" />,
    },
    {
      title: "Domínios",
      href: "/client/domains",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      title: "Pedidos",
      href: "/client/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Faturas",
      href: "/client/invoices",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Métodos de Pagamento",
      href: "/client/payment-methods",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Perfis de Contato",
      href: "/client/contact-profiles",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Suporte",
      href: "/client/support",
      icon: <Ticket className="h-5 w-5" />,
    },
  ];

  // Add link to admin area if user is administrator
  if (isAdmin) {
    menuItems.push({
      title: "Área Administrativa",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
    });
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Sessão encerrada com sucesso");
    } catch (error: any) {
      toast.error(`Erro ao encerrar sessão: ${error.message}`);
    }
  };

  return (
    <div
      className={cn(
        "border-r bg-card transition-all duration-300 h-screen sticky top-0",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className={cn("bg-primary text-primary-foreground", 
                isSuperAdmin ? "bg-red-600" : "")}>
                {user?.email?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className={cn("transition-all", !isOpen && "hidden")}>
              <div className="font-medium">
                {isSuperAdmin ? (
                  <span className="text-red-600 font-bold">Suporte (Admin)</span>
                ) : (
                  user?.user_metadata?.full_name || "Usuário"
                )}
              </div>
              <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                {isSuperAdmin ? (
                  <span className="text-red-500">{user?.email}</span>
                ) : (
                  user?.email
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute -right-3 top-5 bg-background border shadow-sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <Separator />
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              // Special styling for admin-related items when the user is super admin
              const isAdminItem = item.href.includes('/admin');
              const isSuperAdminItem = isSuperAdmin && isAdminItem;
              
              return (
                <Button
                  key={item.href}
                  variant={location.pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !isOpen && "justify-center px-2",
                    isSuperAdminItem && "bg-red-100 hover:bg-red-200",
                    location.pathname === item.href && isSuperAdminItem && "bg-red-200"
                  )}
                  onClick={() => navigate(item.href)}
                >
                  {isSuperAdminItem ? (
                    <span className="text-red-600">{item.icon}</span>
                  ) : (
                    item.icon
                  )}
                  <span
                    className={cn(
                      "ml-3 transition-all",
                      !isOpen && "hidden",
                      isSuperAdminItem && "text-red-600 font-medium"
                    )}
                  >
                    {item.title}
                  </span>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        <div className="p-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              !isOpen && "justify-center px-2"
            )}
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span
              className={cn(
                "ml-3 transition-all",
                !isOpen && "hidden"
              )}
            >
              Sair
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
