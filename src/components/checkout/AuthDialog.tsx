
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  authTab: string;
  setAuthTab: (tab: string) => void;
  isAuthenticating: boolean;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, fullName: string) => Promise<void>;
}

const AuthDialog = ({
  isOpen,
  onOpenChange,
  authTab,
  setAuthTab,
  isAuthenticating,
  onLogin,
  onRegister
}: AuthDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{authTab === 'login' ? 'Acesse sua conta' : 'Criar nova conta'}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={authTab} onValueChange={setAuthTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" className="text-gray-700">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="text-gray-700">Criar Conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm onSubmit={onLogin} isLoading={isAuthenticating} />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm onSubmit={onRegister} isLoading={isAuthenticating} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
