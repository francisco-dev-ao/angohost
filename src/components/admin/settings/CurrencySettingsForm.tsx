
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define a type for the admin settings
type AdminSettings = {
  currencyFormat: string;
  [key: string]: any;
};

export const CurrencySettingsForm = () => {
  const [currencyFormat, setCurrencyFormat] = useState<string>('.');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('admin_settings')
          .select('settings')
          .eq('id', 'general_settings')
          .single();
        
        if (!error && data && data.settings) {
          // Cast settings to AdminSettings type
          const settings = data.settings as AdminSettings;
          if (settings.currencyFormat) {
            setCurrencyFormat(settings.currencyFormat);
          }
        }
      } catch (error) {
        console.error('Error fetching currency settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .upsert(
          {
            id: 'general_settings',
            settings: {
              currencyFormat
            },
            updated_at: new Date().toISOString()
          },
          { onConflict: 'id' }
        );

      if (error) throw error;
      
      toast.success('Configurações de moeda atualizadas com sucesso');
    } catch (error: any) {
      console.error("Error saving currency settings:", error);
      toast.error("Erro ao salvar configurações de moeda: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Moeda</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Configurações de Moeda</CardTitle>
          <CardDescription>
            Configure o formato da moeda usado em todo o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Formato do Separador Decimal</Label>
              <RadioGroup 
                value={currencyFormat} 
                onValueChange={setCurrencyFormat}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="." id="format-dot" />
                  <Label htmlFor="format-dot" className="cursor-pointer">
                    Ponto (15.900kz)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="," id="format-comma" />
                  <Label htmlFor="format-comma" className="cursor-pointer">
                    Vírgula (15,900kz)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="mt-4">
              <Label className="mb-2 block">Exemplo:</Label>
              <div className="p-2 bg-muted rounded">
                <p>Valor mensal: {currencyFormat === ',' ? '1,990kz' : '1.990kz'}</p>
                <p>Valor anual: {currencyFormat === ',' ? '19,900kz' : '19.900kz'}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
