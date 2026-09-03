import React from 'react';
import { JobRequest, WorkerProfile } from '../types';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface DashboardScreenProps {
  worker: WorkerProfile;
  isOnline: boolean;
  onToggleOnline: () => void;
  incomingJobs: JobRequest[];
  onAcceptJob: (job: JobRequest) => void;
  onRejectJob: (jobId: string) => void;
  onViewJobDetail: (job: JobRequest) => void;
  onNavigateToActive: () => void;
  hasActiveJob: boolean;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  worker,
  isOnline,
  onToggleOnline,
  incomingJobs,
  onAcceptJob,
  onRejectJob,
  onViewJobDetail,
  onNavigateToActive,
  hasActiveJob
}) => {
  return (
    <div className="space-y-4 pb-12">
      {/* 1. LARGE UNMISTAKABLE AVAILABILITY TOGGLE - The single most important control in the whole app */}
      <section aria-label="Worker Duty Availability" className="w-full">
        <div 
          id="duty-toggle-container"
          onClick={onToggleOnline}
          className={`w-full border rounded-[10px] p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 ${
            isOnline 
              ? 'bg-[#FFFFFF] border-[#1F4D3D]/40 shadow-sm ring-1 ring-[#1F4D3D]/10' 
              : 'bg-[#FAFAF9] border-[#E7E5E1] opacity-90'
          }`}
          role="region"
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-3">
            {/* Status indicator pip */}
            <div 
              id="duty-indicator" 
              className={`w-4 h-4 rounded-full flex-shrink-0 transition-colors ${
                isOnline 
                  ? 'bg-[#15803D] ring-4 ring-[#15803D]/20 animate-pulse' 
                  : 'bg-[#6B7280]/40'
              }`} 
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 
                  id="duty-status-text" 
                  className="text-[18px] font-[650] text-[#14181F] tracking-tight leading-tight"
                >
                  {isOnline ? 'Duty Active · Online' : 'Duty Paused · Offline'}
                </h2>
                <span 
                  id="duty-badge"
                  className={`px-2 py-0.5 rounded-[8px] text-[11px] font-[600] tracking-wide ${
                    isOnline 
                      ? 'bg-[#E8F5E9] text-[#166534] border border-[#C8E6C9]' 
                      : 'bg-[#E7E5E1] text-[#6B7280]'
                  }`}
                >
                  {isOnline ? 'DISPATCH READY' : 'STANDBY'}
                </span>
              </div>
              <p 
                id="duty-subtext" 
                className="text-[13px] font-[400] text-[#6B7280] mt-1 leading-snug truncate"
              >
                {isOnline 
                  ? `Receiving immediate priority dispatches within ${(worker?.operationalRadiusKm ?? 6.0).toFixed(1)} km radius`
                  : 'No new broadcast dispatches will be routed to your queue'}
              </p>
            </div>
          </div>

          {/* Large tactile switch button (minimum 48px touch target) */}
          <button
            id="duty-switch-btn"
            type="button"
            role="switch"
            aria-checked={isOnline}
            aria-label="Toggle duty online or offline"
            className={`w-15 h-9 rounded-full relative p-1 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 flex-shrink-0 ${
              isOnline ? 'bg-[#1F4D3D]' : 'bg-[#D1CFCA]'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleOnline();
            }}
          >
            <div 
              id="duty-switch-handle" 
              className={`w-7 h-7 bg-[#FFFFFF] rounded-full shadow-md transform transition-transform duration-200 ${
                isOnline ? 'translate-x-6' : 'translate-x-0'
              }`} 
            />
          </button>
        </div>
      </section>

      {/* Active Job Alert Banner if currently running */}
      {hasActiveJob && (
        <div 
          onClick={onNavigateToActive}
          className="bg-[#1F4D3D] text-[#FFFFFF] rounded-[10px] p-4 flex items-center justify-between cursor-pointer hover:bg-[#173C2F] transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8F5E9] animate-ping" />
            <div>
              <span className="text-[11px] font-[600] uppercase tracking-wider text-[#A1D1BC]">
                Job In Progress
              </span>
              <p className="text-[14px] font-[650] leading-tight">
                Underway · Tap to view stepper & client details
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#A1D1BC]" />
        </div>
      )}

      {/* Quick Factual Stats Strip */}
      <section aria-label="Shift Statistics" className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[12px] font-[500] text-[#6B7280]">Today's Jobs</span>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-[22px] font-[650] text-[#14181F] tabular-nums leading-none">
              {worker.dailyJobsCompleted}
            </span>
            <span className="text-[12px] text-[#6B7280] font-[500]">
              / {worker.dailyJobCap} max
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[12px] font-[500] text-[#6B7280]">Today's Payout</span>
          <div className="mt-1.5">
            <span className="text-[22px] font-[650] text-[#14181F] tabular-nums leading-none">
              ₹{worker.todayPayout.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-3 sm:p-4 flex flex-col justify-between">
          <span className="text-[12px] font-[500] text-[#6B7280]">Acceptance</span>
          <div className="mt-1.5 flex items-center gap-1">
            <span className="text-[22px] font-[650] text-[#14181F] tabular-nums leading-none">
              {worker.acceptanceRate}%
            </span>
            <CheckCircle className="w-4 h-4 text-[#1F4D3D]" />
          </div>
        </div>
      </section>

      {/* Section Header: Available Job Broadcasts */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-[17px] font-[650] text-[#14181F] tracking-tight">
            Available Job Broadcasts
          </h3>
          <p className="text-[12px] text-[#6B7280]">
            Civic cooperative dispatch pool · Mayur Vihar Sector
          </p>
        </div>
        <span 
          id="job-count-badge"
          className="px-2.5 py-1 rounded-[8px] bg-[#FFFFFF] border border-[#E7E5E1] text-[#14181F] text-[12px] font-[600] tabular-nums"
        >
          {incomingJobs.length} available
        </span>
      </div>

      {/* Offline state notice */}
      {!isOnline && (
        <div className="bg-[#FAFAF9] border border-[#E7E5E1] rounded-[10px] p-4 text-center">
          <Info className="w-5 h-5 text-[#6B7280] mx-auto mb-1.5" />
          <h4 className="text-[14px] font-[650] text-[#14181F]">You're offline</h4>
          <p className="text-[13px] text-[#6B7280] mt-0.5 max-w-md mx-auto">
            Switch your duty active above to receive real-time cooperative job requests dispatched by citizens in your sector.
          </p>
          <button
            onClick={onToggleOnline}
            className="mt-3 min-h-[44px] px-4 py-2 bg-[#1F4D3D] text-[#FFFFFF] text-[13px] font-[600] rounded-[8px] hover:bg-[#173C2F] transition-colors"
          >
            Go Online Now
          </button>
        </div>
      )}

      {/* Job Cards Stack */}
      {isOnline && incomingJobs.length === 0 && (
        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-8 text-center">
          <ShieldCheck className="w-8 h-8 text-[#1F4D3D] mx-auto mb-2" />
          <h4 className="text-[15px] font-[650] text-[#14181F]">Queue Clear</h4>
          <p className="text-[13px] text-[#6B7280] mt-1">
            No pending broadcast jobs in your immediate {worker.operationalRadiusKm} km sector right now. Keep your duty toggle on to receive incoming requests.
          </p>
        </div>
      )}

      {isOnline && (
        <div className="space-y-3" id="jobs-container">
          {incomingJobs.map((job) => {
            const isEmergency = job.urgency === 'Emergency';

            return (
              <article
                key={job.id}
                id={`job-card-${job.id}`}
                className="bg-[#FFFFFF] border border-[#E7E5E1] hover:border-[#D1CFCA] rounded-[10px] p-4 sm:p-5 shadow-xs transition-colors duration-150 text-left"
              >
                {/* Header Row: Urgency Tag + Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {isEmergency ? (
                      <span className="px-2 py-0.5 rounded-[8px] bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-[12px] font-[600] tracking-tight flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2px]" />
                        Emergency Dispatch
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-[#14181F] text-[12px] font-[600]">
                        {job.urgencyLabel || 'Standard Booking'}
                      </span>
                    )}
                    <span className="text-[12px] text-[#6B7280]">
                      {job.category}
                    </span>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-[20px] font-[650] text-[#14181F] tabular-nums leading-tight">
                      ₹{job.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-[#6B7280]">
                      {job.priceType}
                    </div>
                  </div>
                </div>

                {/* Job Title & Description */}
                <div 
                  className="mt-2.5 cursor-pointer"
                  onClick={() => onViewJobDetail(job)}
                  title="View full job details"
                >
                  <h4 className="text-[16px] font-[650] text-[#14181F] hover:text-[#1F4D3D] transition-colors leading-snug">
                    {job.title}
                  </h4>
                  <p className="text-[13px] text-[#6B7280] mt-1 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Metadata Row: Location and Time */}
                <div className="mt-3 pt-3 border-t border-[#E7E5E1] flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#6B7280]">
                  <div className="flex flex-wrap items-center gap-3.5">
                    <span className="flex items-center gap-1 text-[#14181F] font-[500]">
                      <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                      {job.area} ({job.distanceKm} km)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                      {job.timeWindow}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewJobDetail(job)}
                    className="text-[12px] font-[600] text-[#1F4D3D] hover:underline flex items-center gap-0.5"
                  >
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Direct Accept and Reject Actions (48px tap targets) */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    id={`job-pass-btn-${job.id}`}
                    onClick={() => onRejectJob(job.id)}
                    className="min-h-[48px] h-12 border border-[#E7E5E1] bg-[#FFFFFF] hover:bg-[#FAFAF9] text-[#14181F] font-[600] text-[14px] rounded-[8px] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] select-none"
                  >
                    Pass
                  </button>
                  <button
                    type="button"
                    id={`job-accept-btn-${job.id}`}
                    onClick={() => onAcceptJob(job)}
                    className="min-h-[48px] h-12 bg-[#1F4D3D] hover:bg-[#173C2F] text-[#FFFFFF] font-[600] text-[14px] rounded-[8px] transition-colors flex items-center justify-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 select-none shadow-xs"
                  >
                    <span>Accept Job</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from 'react';
import { supabase } from '../data/supabase';

useEffect(() => {
  // 1. Fetch current bookings
  supabase.from('bookings').select('*').then(({ data }) => setJobs(data || []));

  // 2. Listen live for incoming new jobs
  const subscription = supabase
    .channel('live-jobs')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
      alert('New job received live!');
    })
    .subscribe();

  return () => { supabase.removeChannel(subscription); };
}, []);
