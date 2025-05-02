
import React from 'react';

interface PromotionalBannerProps {
  message?: string;
  className?: string;
}

const PromotionalBanner = ({ 
  message = "+ 3 meses grátis com plano de 48 meses", 
  className = "" 
}: PromotionalBannerProps) => {
  return (
    <div className={`bg-primary/80 text-white rounded-lg p-4 text-center ${className}`}>
      <p className="text-lg md:text-xl font-medium">{message}</p>
    </div>
  );
};

export default PromotionalBanner;
