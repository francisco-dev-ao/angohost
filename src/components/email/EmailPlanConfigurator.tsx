
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface EmailPlanConfiguratorProps {
  userCount: number;
  handleUserCountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  period: string;
  setPeriod: (period: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const EmailPlanConfigurator = ({
  userCount,
  handleUserCountChange,
  period,
  setPeriod,
  selectedTab,
  setSelectedTab,
}: EmailPlanConfiguratorProps) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="userCount" className="mb-2 block">
              Número de usuários
            </Label>
            <Input
              id="userCount"
              type="number"
              min="1"
              max="1000"
              value={userCount}
              onChange={handleUserCountChange}
              className="max-w-full"
            />
          </div>
          
          <div>
            <Label htmlFor="period" className="mb-2 block">
              Período
            </Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 ano</SelectItem>
                <SelectItem value="2">2 anos (10% desconto)</SelectItem>
                <SelectItem value="3">3 anos (10% desconto)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="mb-2 block">Tipo de plano</Label>
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="advanced">Avançado</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPlanConfigurator;
