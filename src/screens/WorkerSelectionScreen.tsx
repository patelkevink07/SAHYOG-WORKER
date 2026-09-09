import React, { useState, useEffect } from 'react';
import { WorkerProfile } from '../types';
import { SahyogLogo } from '../components/SahyogLogo';
import { subscribeToWorkers, DEFAULT_WORKERS } from '../lib/workerService';
import { 
  Wrench, 
  Zap, 
  Hammer, 
  Paintbrush, 
  HeartHandshake, 
  Truck, 
  Sparkles, 
  Cpu, 
  Flower2, 
  Construction,
  Star, 
  Check, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  X
} from 'lucide-react';

interface WorkerSelectionScreenProps {
  currentWorkerId?: string;
  onSelectWorker: (worker: WorkerProfile) => void;
  onCancel?: () => void;
  canCancel?: boolean;
}

// Map trade/category to an icon
function getTradeIcon(trade: string, categoryId?: string) {
  const t = (trade + ' ' + (categoryId || '')).toLowerCase();
  if (t.includes('plumb')) return <Wrench className="w-5 h-5 text-[#1F4D3D]" />;
  if (t.includes('elect')) return <Zap className="w-5 h-5 text-[#D97706]" />;
  if (t.includes('carpent')) return <Hammer className="w-5 h-5 text-[#92400E]" />;
  if (t.includes('elder') || t.includes('care')) return <HeartHandshake className="w-5 h-5 text-[#BE185D]" />;
  if (t.includes('paint')) return <Paintbrush className="w-5 h-5 text-[#0284C7]" />;
  if (t.includes('mov') || t.includes('driv')) return <Truck className="w-5 h-5 text-[#4F46E5]" />;
  if (t.includes('domest') || t.includes('clean')) return <Sparkles className="w-5 h-5 text-[#0D9488]" />;
  if (t.includes('appliance')) return <Cpu className="w-5 h-5 text-[#EA580C]" />;
  if (t.includes('garden')) return <Flower2 className="w-5 h-5 text-[#16A34A]" />;
  return <Construction className="w-5 h-5 text-[#475569]" />;
}

export const WorkerSelectionScreen: React.FC<WorkerSelectionScreenProps> = ({
  currentWorkerId,
  onSelectWorker,
  onCancel,
  canCancel = false
}) => {
  const [workers, setWorkers] = useState<WorkerProfile[]>(DEFAULT_WORKERS);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to live Firestore workers collection
  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToWorkers(
      (updatedWorkers) => {
        setWorkers(updatedWorkers);
        setIsLoading(false);
      },
      (error) => {
        console.warn('Using default worker list due to Firestore notice:', error);
        setIsLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#14181F] flex flex-col items-center px-4 sm:px-6 md:px-8 py-8 md:py-12 antialiased">
      <div className="w-full max-w-5xl lg:max-w-6xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E7E5E1]">
          <div className="flex items-center gap-3.5">
            <SahyogLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] sm:text-[22px] md:text-[26px] font-[650] text-[#14181F] tracking-tight">
                  Switch Worker Persona
                </h1>
                <span className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-[4px] bg-[#E7E5E1] text-[#14181F]">
                  Demo Registry
                </span>
              </div>
              <p className="text-[13px] md:text-[14px] text-[#6B7280] mt-0.5">
                Select any trade partner to operate their live Sahyog dispatch terminal
              </p>
            </div>
          </div>

          {canCancel && onCancel && (
            <button
              type="button"
              id="worker-select-cancel-btn"
              onClick={onCancel}
              className="p-2 text-[#6B7280] hover:text-[#14181F] hover:bg-[#E7E5E1]/60 rounded-[8px] transition-colors"
              title="Return to current worker session"
              aria-label="Close worker selection"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Informational banner */}
        <div className="mb-6 p-4 bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] flex items-start gap-3 shadow-xs">
          <ShieldCheck className="w-5 h-5 text-[#1F4D3D] flex-shrink-0 mt-0.5" />
          <div className="text-[13px] text-[#4B5563] leading-relaxed">
            <span className="font-[600] text-[#14181F]">10 Federation Trades Connected: </span>
            Each card links directly to that worker's assigned dispatch queue in Firestore. Selecting a worker immediately updates the incoming bookings listener, acceptance actions, and status updates for that persona.
          </div>
        </div>

        {/* Worker Cards Grid (10 workers, 1 col on mobile, 2 col on sm/md, 3 col on lg) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
          {workers.map((worker) => {
            const isCurrent = worker.id === currentWorkerId;
            return (
              <button
                key={worker.id}
                type="button"
                id={`select-worker-${worker.id}`}
                onClick={() => onSelectWorker(worker)}
                className={`w-full p-4 md:p-5 rounded-[10px] md:rounded-[12px] border text-left transition-all duration-150 relative flex flex-col justify-between group focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-1 ${
                  isCurrent 
                    ? 'bg-[#F4F9F6] border-[#1F4D3D] shadow-xs' 
                    : 'bg-[#FFFFFF] border-[#E7E5E1] hover:border-[#CBD5E1] hover:shadow-xs'
                }`}
              >
                {/* Active Indicator Chip */}
                {isCurrent && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-[6px] bg-[#1F4D3D] text-[#FFFFFF] text-[10.5px] font-[600] inline-flex items-center gap-1 shadow-xs">
                    <Check className="w-3 h-3 stroke-[3px]" />
                    <span>Active Now</span>
                  </span>
                )}

                <div>
                  {/* Top row: Avatar/Icon + Trade & Name */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-[10px] overflow-hidden bg-[#FAFAF9] border border-[#E7E5E1] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFFFFF] transition-colors">
                      {worker.photoUrl ? (
                        <img
                          src={worker.photoUrl}
                          alt={worker.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getTradeIcon(worker.trade, worker.primaryServiceId)
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-12">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-[700] uppercase tracking-wider text-[#1F4D3D] truncate">
                          {worker.trade}
                        </span>
                      </div>
                      <h3 className="text-[15px] md:text-[16px] font-[650] text-[#14181F] leading-snug truncate mt-0.5 group-hover:text-[#1F4D3D] transition-colors">
                        {worker.name}
                      </h3>
                      <p className="text-[11.5px] text-[#6B7280] truncate mt-0.5 font-mono">
                        {worker.memberId}
                      </p>
                    </div>
                  </div>

                  {/* Federation & Rating */}
                  <div className="mt-3 pt-2.5 border-t border-[#E7E5E1]/60 flex items-center justify-between text-[12px] text-[#6B7280]">
                    <span className="truncate max-w-[170px] text-[#4B5563]">
                      {worker.federationName}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0 font-medium">
                      <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                      <span className="tabular-nums font-semibold text-[#14181F]">
                        {worker.rating.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-[#9CA3AF]">
                        ({worker.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom action hint */}
                <div className="mt-3 pt-2 border-t border-dashed border-[#E7E5E1] flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11.5px] text-[#6B7280] font-mono">
                      ID: {worker.id}
                    </span>
                    {worker.isOnline !== undefined && (
                      <span className={`inline-flex items-center gap-1 text-[10.5px] font-[600] px-1.5 py-0.5 rounded-[6px] ${
                        worker.isOnline 
                          ? 'bg-[#E8F5E9] text-[#166534]' 
                          : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${worker.isOnline ? 'bg-[#166534]' : 'bg-[#9CA3AF]'}`} />
                        {worker.isOnline ? 'Online' : 'Offline'}
                      </span>
                    )}
                  </div>
                  <span className={`inline-flex items-center gap-1 font-[600] text-[12px] transition-colors ${
                    isCurrent ? 'text-[#1F4D3D]' : 'text-[#4B5563] group-hover:text-[#1F4D3D]'
                  }`}>
                    <span>{isCurrent ? 'Continue' : 'Switch'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 border-t border-[#E7E5E1] text-center text-[12px] md:text-[13px] text-[#6B7280]">
          National Cooperative Consumer Federation & Labour Mutual · SIH26089
        </div>
      </div>
    </div>
  );
};
