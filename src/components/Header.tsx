import React, { useState, useEffect } from 'react';
import { SahyogLogo } from './SahyogLogo';
import { WorkerProfile, Dispute } from '../types';
import { Bell, CheckCircle2, ShieldAlert, Star, X, ArrowLeftRight, Scale } from 'lucide-react';
import { subscribeToDisputes } from '../lib/disputeService';

interface HeaderProps {
  worker: WorkerProfile;
  isOnline: boolean;
  onOpenReviews: () => void;
  onNavigateHome: () => void;
  onSwitchWorker?: () => void;
  onSelectDispute: (dispute: Dispute) => void;
}

export const Header: React.FC<HeaderProps> = ({
  worker,
  isOnline,
  onOpenReviews,
  onNavigateHome,
  onSwitchWorker,
  onSelectDispute
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [disputes, setDisputes] = useState<Dispute[]>([]);

  // Live snapshot subscription to disputes filtered by the current worker's ID
  useEffect(() => {
    if (!worker?.id) return;

    const unsubscribe = subscribeToDisputes(
      worker.id,
      (loadedDisputes) => {
        // Sort disputes: unread first, then by lodgedDate descending
        const sorted = [...loadedDisputes].sort((a, b) => {
          if (a.hasWorkerUnreadUpdate && !b.hasWorkerUnreadUpdate) return -1;
          if (!a.hasWorkerUnreadUpdate && b.hasWorkerUnreadUpdate) return 1;
          return b.lodgedDate.localeCompare(a.lodgedDate);
        });
        setDisputes(sorted);
      },
      (error) => {
        console.error('Error in Header dispute subscription:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [worker.id]);

  // Compute unread status based on live disputes collection documents' "hasWorkerUnreadUpdate"
  const hasUnread = disputes.some((d) => d.hasWorkerUnreadUpdate);

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
                {worker.status === 'pending' && (
                  <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded-[4px] bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    Under Review
                  </span>
                )}
                {worker.status === 'rejected' && (
                  <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded-[4px] bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]">
                    Rejected
                  </span>
                )}
                {worker.status === 'held' && (
                  <span className="text-[9.5px] uppercase font-bold px-1.5 py-0.5 rounded-[4px] bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                    Held
                  </span>
                )}
                {(!worker.status || worker.status === 'approved') && (
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#E7E5E1]/70 text-[#14181F]/80">
                    SIH26089
                  </span>
                )}
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
              <span className="tabular-nums font-semibold">
                {worker.reviewCount > 0 ? worker.rating.toFixed(2) : 'New'}
              </span>
              <span className="text-[#6B7280]">({worker.reviewCount})</span>
            </button>

            {/* Notification Bell */}
            <button
              id="header-notif-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
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
                <h3 className="text-[16px] font-[650] text-[#14181F]">Federation Terminal Alerts</h3>
                <p className="text-[12px] text-[#6B7280]">Real-time operational dispatches &amp; disputes</p>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-2 text-[#6B7280] hover:text-[#14181F] rounded-[8px] hover:bg-[#FAFAF9]"
                aria-label="Close notices"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {disputes.length === 0 ? (
                <div className="py-12 text-center max-w-xs mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-[#15803D] mx-auto mb-2" />
                  <h4 className="text-[14px] font-[650] text-[#14181F]">All Clear! No Disputes</h4>
                  <p className="text-[12px] text-[#6B7280] mt-1">
                    You have no active disputes with cooperative citizens. Keep up the clean work!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                    Active Mediation Cases ({disputes.length})
                  </div>
                  {disputes.map((dispute) => (
                    <button
                      key={dispute.id}
                      onClick={() => {
                        onSelectDispute(dispute);
                        setShowNotifications(false);
                      }}
                      className={`w-full p-3.5 border rounded-[10px] text-left transition-colors relative block focus:outline-hidden ${
                        dispute.hasWorkerUnreadUpdate 
                          ? 'bg-[#FEE2E2]/30 border-[#FECACA] hover:bg-[#FEE2E2]/50' 
                          : 'bg-[#FAFAF9] border-[#E7E5E1] hover:bg-[#F5F5F4]'
                      }`}
                    >
                      {dispute.hasWorkerUnreadUpdate && (
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#B91C1C] ring-1 ring-white" />
                      )}
                      
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono text-[#6B7280] font-semibold">
                          Case #{dispute.refNumber}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-[700] uppercase tracking-wider ${
                          dispute.status === 'open' 
                            ? 'bg-[#FEE2E2] text-[#991B1B]' 
                            : dispute.status === 'under_mediation' 
                            ? 'bg-[#FEF3C7] text-[#92400E]' 
                            : 'bg-[#E8F3EE] text-[#1F4D3D]'
                        }`}>
                          {dispute.status === 'under_mediation' ? 'In Mediation' : dispute.status}
                        </span>
                      </div>

                      <h4 className="text-[13px] font-[650] text-[#14181F] leading-tight">
                        {dispute.summary}
                      </h4>
                      
                      <div className="mt-2 flex items-center justify-between text-[11.5px] text-[#6B7280]">
                        <span>Client: <strong className="text-[#14181F]">{dispute.complainantName}</strong></span>
                        <span className="font-semibold text-[#B91C1C] tabular-nums">₹{dispute.escrowAmount}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="pt-4 text-center border-t border-[#E7E5E1] mt-6">
                <span className="text-[11px] text-[#6B7280] block font-medium">
                  Delhi Shramik Cooperative Union · Arbitration Cell
                </span>
                <span className="text-[10px] text-[#9CA3AF] block mt-0.5">
                  Emergency helpline &amp; mutual trust desk: 1800-11-2233
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
