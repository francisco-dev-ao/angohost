
import React from "react";
import DomainSearch from "@/components/DomainSearch";
import { useDomainExtensions } from "@/hooks/useDomainExtensions";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const DomainSearchSection = () => {
  const { extensions, loading } = useDomainExtensions();
  
  const popularExtensions = extensions.filter(ext => ext.is_popular).slice(0, 1);
  const otherExtensions = extensions.filter(ext => !ext.is_popular).slice(0, 3);
  const displayExtensions = [...popularExtensions, ...otherExtensions];
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full">
          <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#1a365d" fillOpacity="0.03" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-angohost-primary">
            Encontre o Seu Domínio Perfeito
          </h2>
          <div className="w-20 h-1.5 bg-angohost-accent mx-auto mt-5 rounded-full"></div>
          <p className="text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
            Registe seu domínio .AO e estabeleça a sua presença online profissional em Angola
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100">
            <h3 className="text-xl font-bold text-angohost-primary mb-6">Digite o nome do domínio desejado</h3>
            <DomainSearch />
            
            {loading ? (
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full" />
                ))}
              </div>
            ) : (
              <div className="mt-10">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Extensões disponíveis</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {displayExtensions.map((domain) => (
                    <motion.div 
                      key={domain.extension} 
                      className={`
                        relative overflow-hidden rounded-xl border p-4
                        ${domain.is_popular 
                          ? 'border-angohost-primary bg-angohost-primary/5 shadow-md' 
                          : 'border-gray-200 hover:border-angohost-primary/50 hover:bg-gray-50'
                        }
                      `}
                      whileHover={{ 
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {domain.is_popular && (
                        <span className="absolute top-0 right-0 bg-angohost-primary text-white text-xs font-medium px-2 py-1 rounded-bl">
                          Popular
                        </span>
                      )}
                      <span className="block text-xl font-bold text-center">{domain.extension}</span>
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="text-sm text-gray-500">AOA</span>
                        <span className="font-bold text-angohost-primary text-lg">{(domain.price / 100).toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DomainSearchSection;
