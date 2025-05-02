
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoginPromptProps {
  onLogin: () => void;
  onRegister: () => void;
}

const LoginPrompt = ({ onLogin, onRegister }: LoginPromptProps) => {
  return (
    <div className="mb-8 p-6 border border-amber-200 bg-amber-50 rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium mb-1">Faça login para continuar com a compra</h3>
          <p className="text-muted-foreground">Para finalizar sua compra, você precisa fazer login ou criar uma conta</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={onLogin}>
            Fazer login
          </Button>
          <Button variant="outline" onClick={onRegister}>
            Criar conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
