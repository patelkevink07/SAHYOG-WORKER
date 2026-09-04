import React, { useState } from 'react';
import { SahyogLogo } from './SahyogLogo';
import { WorkerProfile } from '../types';
import { Bell, CheckCircle2, ShieldAlert, Star, X } from 'lucide-react';

interface HeaderProps {
  worker: WorkerProfile;
  isOnline: boolean;
  onOpenReviews: () => void;
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  worker,
  isOnline,
  onOpenReviews,
  onNavigateHome
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
        className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E7E5E1] transition-colors"
      >
        <div className="max-w-[72rem] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 rounded-[8px] p-1 -ml-1 transition-colors"
            aria-label="Sahyog Worker Home"
          >
            <SahyogLogo size="sm" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-[650] text-[#14181F] leading-tight tracking-tight">
                  Sahyog Partner
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#E7E5E1]/60 text-[#14181F]/80">
                  SIH26089
                </span>
              </div>
              <span className="text-[12px] font-[500] text-[#6B7280] leading-snug flex items-center gap-1 truncate max-w-[200px] sm:max-w-xs">
                {worker.name} · {worker.federationName}
              </span>
            </div>
          </button>

          {/* Quick Actions: Ratings view + Notifications */}
          <div className="flex items-center gap-1.5">
            {/* Quick Ratings & Reviews link button */}
            <button
              id="header-reviews-btn"
              onClick={onOpenReviews}
              title="View Customer Reviews & Ratings"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-[#14181F] hover:bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
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
            className="w-full max-w-sm bg-[#FFFFFF] h-full shadow-2xl flex flex-col border-l border-[#E7E5E1]"
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
