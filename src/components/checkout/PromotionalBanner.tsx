
import React from 'react';

interface PromotionalBannerProps {
  message?: string;
  className?: string;
  isSticky?: boolean;
}

const PromotionalBanner = ({ 
  message = "+ 3 meses grátis com plano de 48 meses", 
  className = "",
  isSticky = false
}: PromotionalBannerProps) => {
  return (
    <div 
      className={`
        bg-primary/90 text-white p-4 text-center
        ${isSticky ? 'sticky z-20 top-0 animate-fadeIn' : 'rounded-lg'}
        ${className}
      `}
    >
      <p className="text-lg md:text-xl font-medium">{message}</p>
    </div>
  );
};

export default PromotionalBanner;
