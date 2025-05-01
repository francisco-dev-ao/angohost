
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading: boolean;
}

export function RegisterForm({ onSubmit, isLoading }: RegisterFormProps) {
  const [nif, setNif] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isNifLoading, setIsNifLoading] = useState(false);
  const [nifError, setNifError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleNifBlur = async () => {
    if (!nif.trim()) return;
    
    setIsNifLoading(true);
    setNifError('');
    
    try {
      const response = await fetch(`https://consulta.edgarsingui.ao/public/consultar-por-nif/${nif}`);
      const data = await response.json();
      
      if (data.data && data.data.success) {
        setFullName(data.data.nome);
        setAddress(data.data.endereco || '');
      } else {
        setNifError('Erro ao consultar o NIF ou BI. Por favor, verifique se está correto.');
      }
    } catch (error) {
      console.error('Erro ao consultar NIF:', error);
      setNifError('Erro ao consultar o NIF ou BI. Por favor, verifique se está correto.');
    } finally {
      setIsNifLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-numeric characters
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 9 digits
    if (value.length > 9) {
      value = value.slice(0, 9);
    }
    
    setPhone(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nif.trim()) {
      setNifError('O NIF/BI é obrigatório para criar uma conta.');
      return;
    }
    
    // Validate phone number
    const phoneRegex = /^9\d{8}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Número de telefone inválido. Deve ter 9 dígitos e começar com 9.');
      return;
    }
    
    await onSubmit(email, password, fullName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nif">NIF ou B.I*</Label>
        <Input 
          id="nif" 
          type="text" 
          placeholder="NIF ou Bilhete de Identidade"
          value={nif}
          onChange={(e) => setNif(e.target.value)}
          onBlur={handleNifBlur}
          required
        />
        <p className="text-sm text-gray-500">Ao informar o NIF, preencheremos alguns campos automaticamente.</p>
        
        {isNifLoading && (
          <div className="flex items-center mt-2 text-sm">
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-gray-500">Consultando seus dados...</span>
          </div>
        )}
        
        {nifError && (
          <p className="text-sm text-red-500 mt-2">{nifError}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="register-email">Email*</Label>
          <Input 
            id="register-email" 
            type="email" 
            placeholder="nome@exemplo.ao"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2 relative">
          <Label htmlFor="register-password">Senha*</Label>
          <div className="relative">
            <Input 
              id="register-password" 
              type={showPassword ? "text" : "password"}
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Fiscal*</Label>
          <Input 
            id="fullName" 
            type="text" 
            placeholder="Nome completo ou nome da empresa"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            readOnly={!!fullName && nif.length > 0}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone*</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="Telefone"
            value={phone}
            onChange={handlePhoneChange}
            required
            pattern="9[0-9]{8}"
            maxLength={9}
          />
          <p className="text-sm text-gray-500">O número deve ter 9 dígitos e começar com 9</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Endereço*</Label>
        <Input 
          id="address" 
          type="text" 
          placeholder="Seu endereço completo"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          readOnly={!!address && nif.length > 0}
          required
        />
      </div>
      
      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-8" 
        type="submit" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            Criando...
          </>
        ) : 'Criar nova conta'}
      </Button>
    </form>
  );
}
