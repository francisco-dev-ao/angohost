
import React from 'react';

interface PromotionalBannerProps {
  message?: string;
  className?: string;
  isSticky?: boolean;
}

const PromotionalBanner = ({ 
  message = "Economize até 75% na Hospedagem Web | Oferta por tempo limitado!",
  className = "",
  isSticky = false
}: PromotionalBannerProps) => {
  return (
    <div 
      className={`
        bg-[#673de6] text-white text-center
        ${isSticky ? 'sticky z-30 top-0 animate-fadeIn' : 'rounded-lg my-4'}
        ${className}
      `}
    >
      <div className="container mx-auto px-4">
        <p className="text-sm md:text-base font-medium py-2">{message}</p>
      </div>
    </div>
  );
};

export default PromotionalBanner;
