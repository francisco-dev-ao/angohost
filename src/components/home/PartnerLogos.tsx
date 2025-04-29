
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const PartnerLogos = () => {
  const partners = [
    { src: '/sonangol.png', alt: 'Sonangol', width: 120 },
    { src: '/kero.png', alt: 'Kero', width: 100 },
    { src: '/isptec.png', alt: 'ISPTEC', width: 110 },
    { src: '/sonair.png', alt: 'Sonair', width: 110 },
    { src: '/redegirassol.jpeg', alt: 'Rede Girassol', width: 100 },
  ];

  return (
    <Card className="bg-white border-0 shadow-sm my-12">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Confiado por empresas líderes em Angola
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partners.map((partner, index) => (
              <div key={index} className="grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
                <img 
                  src={partner.src} 
                  alt={partner.alt} 
                  className="h-12 object-contain" 
                  style={{ width: partner.width }}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerLogos;
