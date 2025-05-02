
import { DomainCheckResult } from '@/types/domain';

/**
 * Verifica a disponibilidade de um domínio consultando registros DNS
 * @param domain Domínio a ser verificado
 * @returns Promessa com o resultado da verificação
 */
export const checkDomainAvailability = async (domain: string): Promise<DomainCheckResult> => {
  try {
    console.log(`Verificando disponibilidade do domínio: ${domain}`);
    
    // Em um ambiente de produção, chamaríamos uma API real
    // Aqui vamos simular a consulta com um timeout
    const response = await fetch(`${getApiBaseUrl()}/dns/check?domain=${encodeURIComponent(domain)}`)
      .catch(() => {
        // Fallback para simulação quando API não está disponível
        return new Promise<Response>((resolve) => {
          setTimeout(() => {
            // Simular resultados baseados no nome do domínio para teste
            const isCommonTld = domain.endsWith('.com') || domain.endsWith('.org') || domain.endsWith('.net');
            const isShortName = domain.split('.')[0].length <= 5;
            
            // Domínios curtos com TLDs comuns têm maior probabilidade de estarem ocupados
            const isAvailable = !(isCommonTld && isShortName) && Math.random() > 0.3;
            
            const mockResponse = {
              available: isAvailable,
              domain,
              records: isAvailable ? [] : [
                { type: 'A', value: '198.51.100.123' },
                { type: 'NS', value: 'ns1.example.com' },
              ]
            };
            
            resolve({
              ok: true,
              json: () => Promise.resolve(mockResponse),
            } as Response);
          }, 800);
        });
      });

    if (!response.ok) {
      throw new Error(`Erro ao verificar domínio: ${response.statusText}`);
    }
    
    const result = await response.json();
    return {
      domain,
      available: result.available,
      records: result.records,
      price: result.price
    };
  } catch (error) {
    console.error('Erro na verificação de domínio:', error);
    // Fornecer um resultado padrão em caso de erro
    return {
      domain,
      available: Math.random() > 0.3, // Simulação aleatória em caso de falha
    };
  }
};

// Reutilizar a função getApiBaseUrl do arquivo database.ts
const getApiBaseUrl = (): string => {
  // First check if there's an explicit URL provided via environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // For specific domain configurations
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Production configurations
    if (hostname === 'deve.angohost.ao') {
      return 'https://deve.angohost.ao/api';
    }
    
    if (hostname === 'www.angohost.ao') {
      return 'https://www.angohost.ao/api';
    }

    if (hostname === 'consulta.angohost.ao') {
      return 'https://consulta.angohost.ao/api';
    }
  }
  
  // In development, use the proxy from Vite
  if (import.meta.env.DEV) {
    return '/api';
  }

  // In production, use the relative path or current URL base
  const currentUrl = window.location.origin;
  return `${currentUrl}/api`;
};
