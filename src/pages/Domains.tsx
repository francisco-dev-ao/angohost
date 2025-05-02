
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import DomainSearch from '@/components/DomainSearch';
import { usePageContent } from '@/hooks/usePageContent';
import { useDomainExtensions } from '@/hooks/useDomainExtensions';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Server, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Domains = () => {
  const { content, loading: contentLoading } = usePageContent('domains');
  const { extensions, loading: extensionsLoading } = useDomainExtensions();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const isLoading = contentLoading || extensionsLoading;
  
  const popularExtensions = extensions.filter(ext => ext.is_popular).slice(0, 1);
  const otherExtensions = extensions.filter(ext => !ext.is_popular).slice(0, 7);
  const displayExtensions = [...popularExtensions, ...otherExtensions];

  // Função para lidar com a submissão da pesquisa de domínio
  const handleDomainSearch = (domain: string) => {
    setSearchQuery(domain);
    // Scroll para os resultados ou outra ação necessária
  };

  return (
    <Layout>
      <div className="container py-12 space-y-12">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-2/4 mx-auto" />
            <Skeleton className="h-16 w-full mx-auto" />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{content?.content?.hero_title || "Registre seu Domínio"}</h1>
            <p className="text-xl text-muted-foreground">
              {content?.content?.hero_description || "Encontre o domínio perfeito para o seu negócio ou projeto em Angola"}
            </p>
          </div>
        )}
        
        <DomainSearch onDomainSearch={handleDomainSearch} />
        
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Domínios .AO</h3>
              <p className="text-muted-foreground mb-4">Estabeleça sua presença online com um domínio angolano oficial.</p>
              <Button variant="outline" onClick={() => navigate('/domains/ao')}>
                Ver preços
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Domínios Internacionais</h3>
              <p className="text-muted-foreground mb-4">Expanda seu alcance global com domínios .com, .net, .org e mais.</p>
              <Button variant="outline" onClick={() => navigate('/domains/international')}>
                Ver preços
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Transferência de Domínio</h3>
              <p className="text-muted-foreground mb-4">Transfira seu domínio existente para nossa plataforma.</p>
              <Button variant="outline" onClick={() => navigate('/domain-transfer')}>
                Transferir agora
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Como funciona o registro de domínio?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left mt-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">1</div>
              <h3 className="font-medium mb-2">Pesquise domínios</h3>
              <p className="text-muted-foreground text-sm">Pesquise o nome que deseja para verificar a disponibilidade.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">2</div>
              <h3 className="font-medium mb-2">Adicione ao carrinho</h3>
              <p className="text-muted-foreground text-sm">Adicione o(s) domínio(s) disponível(is) ao seu carrinho.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">3</div>
              <h3 className="font-medium mb-2">Finalize a compra</h3>
              <p className="text-muted-foreground text-sm">Forneça os dados de titularidade e finalize a compra.</p>
            </div>
          </div>
        </div>

        {!extensionsLoading && displayExtensions.length > 0 && (
          <div className="mt-10">
            <h3 className="text-xl font-bold text-center mb-6">Preços de Domínios</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {displayExtensions.map((domain) => (
                <div 
                  key={domain.extension} 
                  className={`text-center p-3 rounded-lg border ${domain.is_popular ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
                >
                  <span className="block text-lg font-semibold">{domain.extension}</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-sm text-gray-500">AOA</span>
                    <span className="font-bold text-primary">{(domain.price / 100).toFixed(2)}</span>
                  </div>
                  {domain.is_popular && (
                    <span className="inline-block bg-primary text-white text-xs px-2 py-0.5 rounded-full mt-2">
                      Popular
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Button onClick={() => navigate('/domains/pricing')}>
                Ver todos os preços
              </Button>
            </div>
          </div>
        )}
        
        <div className="bg-muted/30 rounded-lg p-8 mt-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Perguntas Frequentes sobre Domínios</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
              <div>
                <h3 className="font-medium mb-2">O que é um domínio?</h3>
                <p className="text-muted-foreground text-sm">Um domínio é o endereço do seu site na internet, como exemplo.com. É o que as pessoas digitam no navegador para acessar seu site.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Quanto tempo leva para ativar meu domínio?</h3>
                <p className="text-muted-foreground text-sm">Os domínios internacionais são ativados quase instantaneamente. Os domínios .ao podem levar até 48 horas para ativação completa.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Posso transferir meu domínio para outro registrador?</h3>
                <p className="text-muted-foreground text-sm">Sim, você pode transferir seu domínio para outro registrador a qualquer momento após 60 dias do registro.</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">O registro de domínio inclui hospedagem?</h3>
                <p className="text-muted-foreground text-sm">Não, o registro de domínio é apenas o endereço. Para ter um site funcional, você também precisará de hospedagem.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Domains;
