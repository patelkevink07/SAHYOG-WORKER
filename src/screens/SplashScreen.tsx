import React, { useEffect, useState } from 'react';
import sahyogLogo from '../sahyog-logo.png';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  minDurationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  minDurationMs = 750 
}) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      const exitTimer = setTimeout(onComplete, 250);
      return () => clearTimeout(exitTimer);
    }, minDurationMs);

    return () => clearTimeout(timer);
  }, [onComplete, minDurationMs]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#FAFAF9] flex flex-col items-center justify-between p-6 transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="status"
      aria-label="Sahyog Cooperative Loading Screen"
    >
      <div className="w-full flex justify-end">
        <span className="text-[11px] font-mono text-[#9CA3AF]">
          SIH26089 · PROD
        </span>
      </div>

      {/* Main Centered Brand Card */}
      <div className="flex flex-col items-center text-center max-w-sm w-full animate-in fade-in zoom-in-95 duration-300">
        {/* White Card Container for Black Line-Art Logo */}
        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[16px] p-6 shadow-sm flex items-center justify-center mb-6 w-full max-w-[280px]">
          <img
            src={sahyogLogo}
            alt="Sahyog Cooperative Logo"
            className="h-20 sm:h-24 w-auto object-contain block"
            style={{ aspectRatio: '1142 / 633' }}
            loading="eager"
            decoding="async"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#E8F3EE] border border-[#C5DDD2] text-[#1F4D3D] text-[12px] font-[600] mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Worker Operational Terminal</span>
        </div>

        <p className="text-[13px] text-[#6B7280] max-w-xs mt-1 leading-relaxed">
          National Cooperative Consumer Federation & Labour Mutual
        </p>

        {/* Minimal Spinner / Progress Pulse */}
        <div className="mt-8 flex items-center gap-2 text-[12px] text-[#6B7280]">
          <div className="w-2 h-2 rounded-full bg-[#1F4D3D] animate-ping" />
          <span>Syncing trade dispatch mesh...</span>
        </div>
      </div>

      {/* Footer verified seal */}
      <div className="flex items-center gap-1.5 text-[11.5px] text-[#9CA3AF]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#1F4D3D]" />
        <span>Cooperative Welfare Verified</span>
      </div>
    </div>
  );
};
