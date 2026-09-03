import React from 'react';

interface SahyogLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SahyogLogo: React.FC<SahyogLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14'
  }[size];

  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg bg-[#1F4D3D] text-[#FAFAF9] p-1.5 select-none shadow-xs ${sizeClasses} ${className}`}
      aria-label="Sahyog Cooperative Logo"
    >
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Cooperative Reaching Hands Vector */}
        {/* Left hand reaching forward */}
        <path
          d="M 12 34 C 18 31, 24 29, 30 31 C 32 31.5, 35 34, 37 34 C 38.5 34, 39.5 33, 40 31.5 C 38 29.5, 34 29, 30 28 C 24 26.5, 18 29, 12 34 Z"
          fill="currentColor"
          opacity="0.95"
        />
        {/* Left thumb & fingers line */}
        <path
          d="M 14 30 C 20 25, 27 23, 34 26 C 37 27.5, 41 27.5, 44 26.5 C 43 25, 39 24.5, 35 24 C 29 23, 21 25, 14 30 Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Right hand supporting from below */}
        <path
          d="M 52 32 C 46 35, 40 37, 34 35 C 32 34.5, 29 32, 27 32 C 25.5 32, 24.5 33, 24 34.5 C 26 36.5, 30 37, 34 38 C 40 39.5, 46 37, 52 32 Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M 50 36 C 44 41, 37 43, 30 40 C 27 38.5, 23 38.5, 20 39.5 C 21 41, 25 41.5, 29 42 C 35 43, 43 41, 50 36 Z"
          fill="currentColor"
          opacity="0.9"
        />
        {/* Center mutual handshake knot / bond */}
        <circle cx="32" cy="33" r="2.5" fill="#C9A227" />
      </svg>
    </div>
  );
};
