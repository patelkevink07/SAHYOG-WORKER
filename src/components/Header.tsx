import React, { useState } from 'react';
import { SahyogLogo } from './SahyogLogo';
import { WorkerProfile } from '../types';
import { Bell, CheckCircle2, ShieldAlert, Star, X, ArrowLeftRight } from 'lucide-react';

interface HeaderProps {
  worker: WorkerProfile;
  isOnline: boolean;
  onOpenReviews: () => void;
  onNavigateHome: () => void;
  onSwitchWorker?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  worker,
  isOnline,
  onOpenReviews,
  onNavigateHome,
  onSwitchWorker
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const notifications = [
    {
      id: 'n-1',
      title: 'Emergency dispatch pool active',
      time: '10m ago',
      desc: 'High demand for plumbers detected in Mayur Vihar & Patparganj.',
      type: 'dispatch'
    },
    {
      id: 'n-2',
      title: 'Weekly settlement credited',
      time: 'Yesterday',
      desc: '₹7,920 settled via NEFT to HDFC Bank ****4102. Ref: COOP-TXN-88192.',
      type: 'settlement'
    },
    {
      id: 'n-3',
      title: 'NCCT compliance valid',
      time: '3 days ago',
      desc: 'Annual trade verification and health mutual cover renewed through Dec 2026.',
      type: 'welfare'
    }
  ];

  return (
    <>
      <header 
        id="app-top-header" 
        className="sticky top-0 z-30 bg-[#FFFFFF] border-b border-[#E7E5E1] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo & Identity (Responsive: full badge on mobile, contextual breadcrumb/partner mark on desktop) */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 rounded-[8px] p-1 -ml-1 transition-colors"
            aria-label="Sahyog Worker Home"
          >
            <SahyogLogo size="sm" variant="badge" />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] sm:text-[14px] md:text-[15px] font-[700] tracking-tight text-[#1F4D3D]">
                  Partner Terminal
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#E7E5E1]/70 text-[#14181F]/80">
                  SIH26089
                </span>
              </div>
              <span className="text-[11.5px] sm:text-[12px] font-[500] text-[#6B7280] leading-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-xs md:max-w-sm">
                {worker.name} · {worker.trade}
              </span>
            </div>
          </button>

          {/* Quick Actions: Switch Worker + Ratings view + Notifications */}
          <div className="flex items-center gap-1.5 md:gap-2.5">
            {onSwitchWorker && (
              <button
                id="header-switch-worker-btn"
                type="button"
                onClick={onSwitchWorker}
                title="Switch Worker Persona (Demo)"
                className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-[12px] font-semibold text-[#1F4D3D] bg-[#F4F9F6] hover:bg-[#E8F3EE] border border-[#C5DDD2] rounded-[8px] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-[#1F4D3D]" />
                <span className="hidden xs:inline sm:inline">Switch Worker</span>
                <span className="inline xs:hidden sm:hidden">Switch</span>
              </button>
            )}

            {/* Quick Ratings & Reviews link button */}
            <button
              id="header-reviews-btn"
              onClick={onOpenReviews}
              title="View Customer Reviews & Ratings"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 text-[12px] font-medium text-[#14181F] hover:bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
            >
              <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
              <span className="tabular-nums font-semibold">{worker.rating.toFixed(2)}</span>
              <span className="text-[#6B7280]">({worker.reviewCount})</span>
            </button>

            {/* Notification Bell */}
            <button
              id="header-notif-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setHasUnread(false);
              }}
              className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6B7280] hover:text-[#14181F] hover:bg-[#FAFAF9] rounded-[8px] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#B91C1C] ring-2 ring-[#FFFFFF]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer Modal */}
      {showNotifications && (
        <div 
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex justify-end animate-fadeIn"
          onClick={() => setShowNotifications(false)}
        >
          <div 
            className="w-full max-w-sm md:max-w-md bg-[#FFFFFF] h-full shadow-2xl flex flex-col border-l border-[#E7E5E1]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#E7E5E1] flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-[650] text-[#14181F]">Federation Notices</h3>
                <p className="text-[12px] text-[#6B7280]">Real-time operational dispatches</p>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 text-[#6B7280] hover:text-[#14181F] rounded-[8px] hover:bg-[#FAFAF9]"
                aria-label="Close notices"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.map((n) => (
                <div 
                  key={n.id}
                  className="p-3.5 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[10px] text-left"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-[650] text-[#14181F] flex items-center gap-1.5">
                      {n.type === 'dispatch' && <ShieldAlert className="w-3.5 h-3.5 text-[#1F4D3D]" />}
                      {n.type === 'settlement' && <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />}
                      {n.title}
                    </span>
                    <span className="text-[11px] text-[#6B7280] tabular-nums">{n.time}</span>
                  </div>
                  <p className="text-[12px] text-[#6B7280] leading-relaxed">{n.desc}</p>
                </div>
              ))}

              <div className="pt-2 text-center">
                <span className="text-[11px] text-[#6B7280]">
                  Delhi Shramik Cooperative Union · Emergency Helpline: 1800-11-2233
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
