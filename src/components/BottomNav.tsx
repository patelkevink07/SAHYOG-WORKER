import React from 'react';
import { ScreenType } from '../types';
import { ClipboardList, Clock, Wallet, User, MessageSquare } from 'lucide-react';

interface BottomNavProps {
  currentScreen: ScreenType;
  hasActiveJob: boolean;
  onSelectScreen: (screen: ScreenType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  hasActiveJob,
  onSelectScreen
}) => {
  const navItems = [
    {
      id: 'dashboard' as ScreenType,
      label: 'Jobs',
      icon: ClipboardList
    },
    {
      id: 'active_job' as ScreenType,
      label: 'Active',
      icon: Clock,
      hasBadge: hasActiveJob
    },
    {
      id: 'earnings' as ScreenType,
      label: 'Earnings',
      icon: Wallet
    },
    {
      id: 'reviews' as ScreenType,
      label: 'Reviews',
      icon: MessageSquare
    },
    {
      id: 'profile' as ScreenType,
      label: 'Profile',
      icon: User
    }
  ];

  return (
    <nav 
      id="bottom-app-navigation"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#E7E5E1] shadow-[0_-2px_10px_rgba(20,24,31,0.03)]"
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
  );
};
