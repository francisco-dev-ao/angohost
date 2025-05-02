
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Package, Server } from 'lucide-react';

interface HostingTypesSelectorProps {
  hostingType: string;
  setHostingType: (value: string) => void;
  billingPeriod: string;
  setBillingPeriod: (value: string) => void;
}

const HostingTypesSelector = ({ 
  hostingType, 
  setHostingType, 
  billingPeriod, 
  setBillingPeriod 
}: HostingTypesSelectorProps) => {
  return (
    <div className="flex flex-col items-center space-y-8 mb-12">
      <Tabs 
        defaultValue="shared" 
        value={hostingType}
        onValueChange={setHostingType}
        className="w-full max-w-md"
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="shared">
            <Globe className="mr-2 h-4 w-4" />
            Compartilhada
          </TabsTrigger>
          <TabsTrigger value="wordpress">
            <Package className="mr-2 h-4 w-4" />
            WordPress
          </TabsTrigger>
          <TabsTrigger value="vps">
            <Server className="mr-2 h-4 w-4" />
            VPS
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Tabs 
        defaultValue="1" 
        value={billingPeriod}
        onValueChange={setBillingPeriod}
        className="w-full max-w-md"
      >
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="1">1 ano</TabsTrigger>
          <TabsTrigger value="2">2 anos</TabsTrigger>
          <TabsTrigger value="3">3 anos</TabsTrigger>
          <TabsTrigger value="4">4 anos</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default HostingTypesSelector;
