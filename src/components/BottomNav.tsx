import React from 'react';
import { ScreenType, WorkerProfile } from '../types';
import { SahyogLogo } from './SahyogLogo';
import { getLocalWorkerPhoto } from '../lib/workerPhotos';
import { 
  ClipboardList, 
  Clock, 
  Wallet, 
  User, 
  MessageSquare, 
  ArrowLeftRight,
  ShieldCheck,
  PhoneCall,
  Check
} from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenType;
  hasActiveJob: boolean;
  onSelectScreen: (screen: ScreenType) => void;
  worker?: WorkerProfile;
  isOnline?: boolean;
  onSwitchWorker?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  hasActiveJob,
  onSelectScreen,
  worker,
  isOnline,
  onSwitchWorker
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Reset image error state when worker photo changes
  React.useEffect(() => {
    setImageError(false);
  }, [worker?.photoUrl]);

  const navItems = [
    {
      id: 'dashboard' as ScreenType,
      label: 'Jobs',
      desktopLabel: 'Job Broadcasts',
      description: 'Incoming dispatch queue',
      icon: ClipboardList
    },
    {
      id: 'active_job' as ScreenType,
      label: 'Active',
      desktopLabel: 'Active Service',
      description: 'Execution & stepper',
      icon: Clock,
      hasBadge: hasActiveJob
    },
    {
      id: 'earnings' as ScreenType,
      label: 'Earnings',
      desktopLabel: 'Settlement & Ledger',
      description: 'Weekly pay & welfare',
      icon: Wallet
    },
    {
      id: 'reviews' as ScreenType,
      label: 'Reviews',
      desktopLabel: 'Citizen Reviews',
      description: 'Verified feedback & rating',
      icon: MessageSquare
    },
    {
      id: 'profile' as ScreenType,
      label: 'Profile',
      desktopLabel: 'Worker Profile',
      description: 'Credentials & NCCT ID',
      icon: User
    }
  ];

  return (
    <>
      {/* 1. MOBILE BOTTOM TAB BAR (Fixed bottom-0, strictly md:hidden - unchanged mobile UX) */}
      <nav 
        id="bottom-app-navigation"
        aria-label="Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E7E5E1] shadow-[0_-2px_10px_rgba(20,24,31,0.03)]"
      >
        <div className="max-w-[72rem] mx-auto grid grid-cols-5 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || (currentScreen === 'job_detail' && item.id === 'dashboard');

            return (
              <button
                key={item.id}
                id={`nav-btn-${item.id}`}
                onClick={() => onSelectScreen(item.id)}
                className={`min-h-[48px] h-full flex flex-col items-center justify-center relative select-none transition-colors duration-150 active:scale-95 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 ${
                  isActive 
                    ? 'text-[#1F4D3D] font-[650]' 
                    : 'text-[#6B7280] hover:text-[#14181F] font-[500]'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.3px]' : 'stroke-[1.8px]'}`} />
                  {item.hasBadge && (
                    <span 
                      id="nav-active-dot" 
                      className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-[#1F4D3D] ring-2 ring-[#FFFFFF] animate-pulse" 
                      title="Active job in progress"
                    />
                  )}
                </div>
                <span className={`text-[11px] mt-1 leading-none tracking-tight ${isActive ? 'font-[650]' : 'font-[500]'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2. DESKTOP PERSISTENT LEFT SIDEBAR (Visible on md+ >=768px, persistent left dock) */}
      <aside
        id="desktop-sidebar-navigation"
        aria-label="Desktop Sidebar Navigation"
        className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-64 lg:w-72 bg-[#FFFFFF] border-r border-[#E7E5E1] z-40 select-none shadow-[1px_0_10px_rgba(20,24,31,0.02)]"
      >
        {/* Brand & Identity Header */}
        <div className="p-5 lg:p-6 border-b border-[#E7E5E1]">
          <div className="flex items-center gap-3">
            <SahyogLogo size="sm" variant="badge" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[14px] lg:text-[15px] font-[750] tracking-tight text-[#1F4D3D]">
                  Sahyog Partner
                </span>
                <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded-[4px] bg-[#E7E5E1]/80 text-[#14181F]/90">
                  SIH26089
                </span>
              </div>
              <p className="text-[11.5px] text-[#6B7280] truncate mt-0.5">
                Worker Operational Mesh
              </p>
            </div>
          </div>

          {/* Active Worker Status Summary in Sidebar */}
          {worker && (
            <div className="mt-4 p-3 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-left">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {worker.photoUrl && !imageError ? (
                    <img
                       src={worker.photoUrl}
                       alt={worker.name}
                       className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-[#E7E5E1]"
                       referrerPolicy="no-referrer"
                       onError={() => setImageError(true)}
                    />
                  ) : (
                    <img
                       src={getLocalWorkerPhoto(worker.primaryServiceId, worker.trade)}
                       alt={worker.name}
                       className="w-7 h-7 rounded-full object-cover flex-shrink-0 ring-1 ring-[#E7E5E1]"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-[650] text-[#14181F] truncate leading-tight">
                      {worker.name}
                    </p>
                    <p className="text-[11px] text-[#6B7280] truncate">
                      {worker.trade}
                    </p>
                  </div>
                </div>

                {isOnline !== undefined && (
                  <span 
                    className={`inline-flex items-center gap-1 text-[10.5px] font-[600] px-2 py-0.5 rounded-[6px] flex-shrink-0 ${
                      isOnline 
                        ? 'bg-[#E8F5E9] text-[#166534]' 
                        : 'bg-[#F3F4F6] text-[#6B7280]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#166534] animate-pulse' : 'bg-[#9CA3AF]'}`} />
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10.5px] font-[700] uppercase tracking-wider text-[#9CA3AF]">
            Terminal Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id || (currentScreen === 'job_detail' && item.id === 'dashboard');

            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => onSelectScreen(item.id)}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-[8px] flex items-center justify-between text-left transition-all group focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] ${
                  isActive
                    ? 'bg-[#F4F9F6] text-[#1F4D3D] font-[650] shadow-xs'
                    : 'text-[#4B5563] hover:bg-[#FAFAF9] hover:text-[#14181F] font-[500]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-[6px] transition-colors ${
                    isActive ? 'bg-[#1F4D3D] text-[#FFFFFF]' : 'bg-[#FAFAF9] text-[#6B7280] group-hover:text-[#14181F]'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] leading-tight truncate">
                      {item.desktopLabel}
                    </p>
                    <p className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-[#1F4D3D]/80' : 'text-[#9CA3AF]'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>

                {item.hasBadge && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1F4D3D] text-[#FFFFFF] text-[10px] font-bold uppercase tracking-wider animate-pulse flex-shrink-0">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3.5 lg:p-4 border-t border-[#E7E5E1] space-y-2.5 bg-[#FFFFFF]">
          {onSwitchWorker && (
            <button
              type="button"
              id="sidebar-switch-worker-btn"
              onClick={onSwitchWorker}
              className="w-full min-h-[38px] px-3 py-2 text-[12px] font-[600] text-[#1F4D3D] bg-[#F4F9F6] hover:bg-[#E8F3EE] border border-[#C5DDD2] rounded-[8px] transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#1F4D3D]" />
              <span>Switch Worker Persona</span>
            </button>
          )}

          <div className="p-2.5 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1]/80 text-[11px] text-[#6B7280]">
            <div className="flex items-center gap-1.5 font-[600] text-[#14181F] mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D3D]" />
              <span>Delhi Shramik Union</span>
            </div>
            <p className="text-[10.5px] leading-tight text-[#9CA3AF]">
              NCCT Certified Mutual · Helpline: 1800-11-2233
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
