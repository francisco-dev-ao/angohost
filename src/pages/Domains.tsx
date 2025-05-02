
import React from 'react';
import Layout from '@/components/Layout';
import DomainSearch from '@/components/DomainSearch';
import { usePageContent } from '@/hooks/usePageContent';
import { useDomainExtensions } from '@/hooks/useDomainExtensions';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/utils/formatters';

const Domains = () => {
  const { content, loading: contentLoading } = usePageContent('domains');
  const { extensions, loading: extensionsLoading } = useDomainExtensions();

  const isLoading = contentLoading || extensionsLoading;
  
  const popularExtensions = extensions.filter(ext => ext.is_popular).slice(0, 1);
  const otherExtensions = extensions.filter(ext => !ext.is_popular).slice(0, 3);
  const displayExtensions = [...popularExtensions, ...otherExtensions];

  return (
    <Layout>
      <div className="container py-12 space-y-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-2/4 mx-auto" />
            <Skeleton className="h-16 w-full mx-auto" />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{content?.content?.hero_title || "Pesquisa de Domínios"}</h1>
            <p className="text-xl text-muted-foreground">
              {content?.content?.hero_description || "Encontre o domínio perfeito para o seu negócio em Angola"}
            </p>
          </div>
        )}
        
        <DomainSearch />
        
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
                  className={`text-center p-3 rounded-lg border ${domain.is_popular ? 'border-[#345990] bg-[#345990]/5' : 'border-gray-200'}`}
                >
                  <span className="block text-lg font-semibold">{domain.extension}</span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-sm text-gray-500">AOA</span>
                    <span className="font-bold text-[#345990]">{(domain.price / 100).toFixed(2)}</span>
                  </div>
                  {domain.is_popular && (
                    <span className="inline-block bg-[#345990] text-white text-xs px-2 py-0.5 rounded-full mt-2">
                      Popular
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Domains;
