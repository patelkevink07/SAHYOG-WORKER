import React from 'react';
import sahyogLogo from '../sahyog-logo.png';

export { sahyogLogo };

interface SahyogLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'inline' | 'card' | 'badge';
  alt?: string;
}

export const SahyogLogo: React.FC<SahyogLogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'badge',
  alt = 'Sahyog Cooperative Logo'
}) => {
  // Height & container proportions maintaining natural 1.8:1 aspect ratio without stretching
  const sizeConfig = {
    sm: {
      imgClass: 'h-8 sm:h-9 max-w-[140px]',
      containerClass: 'p-1 px-2 min-h-[36px]'
    },
    md: {
      imgClass: 'h-10 sm:h-12 max-w-[190px]',
      containerClass: 'p-1.5 px-3 min-h-[44px]'
    },
    lg: {
      imgClass: 'h-16 sm:h-20 max-w-[260px]',
      containerClass: 'p-2.5 px-4 min-h-[72px]'
    },
    xl: {
      imgClass: 'h-24 sm:h-28 max-w-[340px]',
      containerClass: 'p-3.5 px-5 min-h-[100px]'
    }
  }[size];

  // Guaranteed light/white surface backing for black line art
  const surfaceClass = variant === 'inline' 
    ? 'bg-[#FFFFFF] rounded-[8px]'
    : 'bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] shadow-2xs';

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${surfaceClass} ${sizeConfig.containerClass} ${className}`}
      aria-label={alt}
    >
      <img
        src={sahyogLogo}
        alt={alt}
        className={`${sizeConfig.imgClass} w-auto object-contain block`}
        style={{ aspectRatio: '1142 / 633' }}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
