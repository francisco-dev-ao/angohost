
import { useState, useEffect } from 'react';

export const useScrollBehavior = (threshold = 300) => {
  const [showStickyBanner, setShowStickyBanner] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowStickyBanner(scrollPosition > threshold);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return { showStickyBanner };
};
