import React from 'react';
import { JobRequest, WorkerProfile, JOB_CATEGORY_LABELS } from '../types';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck, 
  Zap, 
  Info,
  AlertCircle,
  XCircle,
  PauseCircle,
  FileText,
  UserCheck,
  Building,
  CreditCard
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
  const isPending = worker.status === 'pending';
  const isRejected = worker.status === 'rejected';
  const isHeld = worker.status === 'held';

  // 1. PENDING VERIFICATION STATE (Gated Dashboard)
  if (isPending) {
    return (
      <div className="space-y-5 md:space-y-6 pb-12">
        {/* Verification Status Header Card */}
        <div className="bg-[#FFFBEB] border-2 border-[#FDE68A] rounded-[12px] p-5 md:p-6 shadow-xs text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center flex-shrink-0 text-[#92400E]">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] md:text-[19px] font-[700] text-[#92400E] tracking-tight">
                  Your registration is under federation review
                </h2>
                <span className="px-2.5 py-0.5 rounded-[6px] bg-[#FEF3C7] text-[#92400E] text-[11px] font-[700] uppercase tracking-wider border border-[#FDE68A]">
                  Review Pending
                </span>
              </div>
              <p className="text-[13.5px] text-[#B45309] mt-1 leading-relaxed">
                Thank you for applying to the Sahyog Federation Trade Registry. Your credentials, background check, and trade qualifications are currently being reviewed by federation administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Live Real-Time Notice */}
        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[12px] p-5 md:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E7E5E1]">
            <ShieldCheck className="w-4 h-4 text-[#1F4D3D]" />
            <h3 className="text-[15px] font-[700] text-[#14181F]">Submitted Application Summary</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-[13px]">
            <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]">
              <span className="text-[#6B7280] block text-[11.5px] font-semibold uppercase tracking-wider">Applicant Name</span>
              <span className="font-[650] text-[#14181F] text-[14px] mt-0.5 block">{worker.name}</span>
            </div>

            <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]">
              <span className="text-[#6B7280] block text-[11.5px] font-semibold uppercase tracking-wider">Trade Discipline</span>
              <span className="font-[650] text-[#1F4D3D] text-[14px] mt-0.5 block">{worker.trade}</span>
            </div>

            <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]">
              <span className="text-[#6B7280] block text-[11.5px] font-semibold uppercase tracking-wider">Registration Reference</span>
              <span className="font-mono text-[#14181F] text-[13px] mt-0.5 block">{worker.memberId}</span>
            </div>

            <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]">
              <span className="text-[#6B7280] block text-[11.5px] font-semibold uppercase tracking-wider">Federation Chapter</span>
              <span className="font-[550] text-[#14181F] mt-0.5 block">{worker.federationName}</span>
            </div>

            <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]">
              <span className="text-[#6B7280] block text-[11.5px] font-semibold uppercase tracking-wider">Contact Phone</span>
              <span className="font-mono text-[#14181F] mt-0.5 block">{worker.phone}</span>
            </div>

            <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]">
              <span className="text-[#6B7280] block text-[11.5px] font-semibold uppercase tracking-wider">Standard Tariff</span>
              <span className="font-[650] text-[#14181F] mt-0.5 block">₹{worker.hourlyRate || 350} / hour</span>
            </div>
          </div>

          {/* Verification Steps Status */}
          <div className="mt-4 pt-4 border-t border-[#E7E5E1] space-y-2.5">
            <h4 className="text-[13px] font-[700] text-[#14181F]">Verification Pipeline</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-[12.5px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EAB308] animate-ping" />
                  <span className="font-[600] text-[#14181F]">Delhi Police Central Registry Verification</span>
                </div>
                <span className="text-[#92400E] font-semibold text-[11.5px]">In Progress</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-[12.5px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EAB308]" />
                  <span className="font-[600] text-[#14181F]">NCCT Skill Accreditation Audit</span>
                </div>
                <span className="text-[#92400E] font-semibold text-[11.5px]">Under Review</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-[12.5px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#EAB308]" />
                  <span className="font-[600] text-[#14181F]">Solidarity Health & Welfare Pool Enrollment</span>
                </div>
                <span className="text-[#92400E] font-semibold text-[11.5px]">Pending Approval</span>
              </div>
            </div>
          </div>

          {/* Real-Time Live Sync Alert */}
          <div className="p-3.5 rounded-[8px] bg-[#F4F9F6] border border-[#1F4D3D]/20 flex items-start gap-3 text-[12.5px] text-[#1F4D3D]">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#1F4D3D]" />
            <div className="leading-relaxed">
              <span className="font-[700]">Real-time Live Sync: </span>
              This screen is live-subscribed to your federation record. As soon as an administrator approves your profile, this banner will automatically clear and the live dispatch queue will unlock immediately.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. REJECTED STATE (Gated Dashboard)
  if (isRejected) {
    return (
      <div className="space-y-5 md:space-y-6 pb-12">
        <div className="bg-[#FEF2F2] border-2 border-[#FCA5A5] rounded-[12px] p-5 md:p-6 shadow-xs text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center flex-shrink-0 text-[#991B1B]">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] md:text-[19px] font-[700] text-[#991B1B] tracking-tight">
                  Your registration application was not approved
                </h2>
                <span className="px-2.5 py-0.5 rounded-[6px] bg-[#FEE2E2] text-[#991B1B] text-[11px] font-[700] uppercase tracking-wider border border-[#FECACA]">
                  Rejected
                </span>
              </div>

              {worker.rejectionReason ? (
                <div className="mt-3 p-3.5 bg-[#FFFFFF] rounded-[8px] border border-[#FCA5A5] text-[13px] text-[#991B1B]">
                  <span className="font-[700] block text-[11.5px] uppercase tracking-wider mb-1">Reason provided by administrator:</span>
                  <p className="font-[500] leading-relaxed">{worker.rejectionReason}</p>
                </div>
              ) : (
                <p className="text-[13.5px] text-[#B91C1C] mt-2 leading-relaxed">
                  The federation review board was unable to verify mandatory trade certifications or police registry credentials.
                </p>
              )}

              <p className="text-[12.5px] text-[#7F1D1D] mt-3">
                For assistance or resubmission of corrected documentation, please contact the Sahyog Federation Helpdesk or visit your local cooperative chapter office.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. HELD STATE (Gated Dashboard)
  if (isHeld) {
    return (
      <div className="space-y-5 md:space-y-6 pb-12">
        <div className="bg-[#F8FAFC] border-2 border-[#CBD5E1] rounded-[12px] p-5 md:p-6 shadow-xs text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center flex-shrink-0 text-[#475569]">
              <PauseCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[17px] md:text-[19px] font-[700] text-[#334155] tracking-tight">
                  Your registration is temporarily held
                </h2>
                <span className="px-2.5 py-0.5 rounded-[6px] bg-[#E2E8F0] text-[#475569] text-[11px] font-[700] uppercase tracking-wider border border-[#CBD5E1]">
                  Temporarily Held
                </span>
              </div>
              <p className="text-[13.5px] text-[#64748B] mt-2 leading-relaxed">
                Your dispatch terminal access is paused pending annual credential verification, updated police certificate submission, or cooperative audit.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. APPROVED / DEFAULT STATE (Normal full dashboard)
  return (
    <div className="space-y-4 md:space-y-6 pb-12">
      {/* 1. LARGE UNMISTAKABLE AVAILABILITY TOGGLE - The single most important control in the whole app */}
      <section aria-label="Worker Duty Availability" className="w-full">
        <div 
          id="duty-toggle-container"
          onClick={onToggleOnline}
          className={`w-full border rounded-[10px] md:rounded-[12px] p-4 sm:p-5 md:p-6 flex items-center justify-between cursor-pointer select-none transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 ${
            isOnline 
              ? 'bg-[#FFFFFF] border-[#1F4D3D]/40 shadow-sm ring-1 ring-[#1F4D3D]/10' 
              : 'bg-[#FAFAF9] border-[#E7E5E1] opacity-90'
          }`}
          role="region"
        >
          <div className="flex items-center gap-3.5 md:gap-4 flex-1 min-w-0 pr-3">
            {/* Status indicator pip */}
            <div 
              id="duty-indicator" 
              className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex-shrink-0 transition-colors ${
                isOnline 
                  ? 'bg-[#15803D] ring-4 ring-[#15803D]/20 animate-pulse' 
                  : 'bg-[#6B7280]/40'
              }`} 
            />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 
                  id="duty-status-text" 
                  className="text-[18px] md:text-[21px] font-[650] text-[#14181F] tracking-tight leading-tight"
                >
                  {isOnline ? 'Duty Active · Online' : 'Duty Paused · Offline'}
                </h2>
                <span 
                  id="duty-badge"
                  className={`px-2 py-0.5 rounded-[8px] text-[11px] md:text-[12px] font-[600] tracking-wide ${
                    isOnline 
                      ? 'bg-[#E8F5E9] text-[#166534] border border-[#C8E6C9]' 
                      : 'bg-[#E7E5E1] text-[#6B7280]'
                  }`}
                >
                  {isOnline ? 'DISPATCH READY' : 'OFFLINE MODE'}
                </span>
              </div>
              <p 
                id="duty-subtext" 
                className="text-[13px] md:text-[14px] font-[400] text-[#6B7280] mt-1 leading-snug truncate"
              >
                {isOnline 
                  ? `Online on citizen apps · Receiving dispatches within ${worker.operationalRadiusKm.toFixed(1)} km sector`
                  : 'Status listed as offline on citizen apps · Queue remains accessible'}
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
            className={`w-15 md:w-16 h-9 md:h-10 rounded-full relative p-1 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 flex-shrink-0 ${
              isOnline ? 'bg-[#1F4D3D]' : 'bg-[#D1CFCA]'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleOnline();
            }}
          >
            <div 
              id="duty-switch-handle" 
              className={`w-7 h-7 md:w-8 md:h-8 bg-[#FFFFFF] rounded-full shadow-md transform transition-transform duration-200 ${
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
          className="bg-[#1F4D3D] text-[#FFFFFF] rounded-[10px] md:rounded-[12px] p-4 md:p-5 flex items-center justify-between cursor-pointer hover:bg-[#173C2F] transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8F5E9] animate-ping" />
            <div>
              <span className="text-[11px] md:text-[12px] font-[600] uppercase tracking-wider text-[#A1D1BC]">
                Job In Progress
              </span>
              <p className="text-[14px] md:text-[16px] font-[650] leading-tight">
                Underway · Tap to view stepper & client details
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#A1D1BC]" />
        </div>
      )}

      {/* Quick Factual Stats Strip */}
      <section aria-label="Shift Statistics" className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] md:text-[13px] font-[500] text-[#6B7280]">Today's Jobs</span>
            <span className="text-[11px] font-semibold text-[#1F4D3D] bg-[#F4F9F6] px-1.5 py-0.5 rounded-[4px] border border-[#C5DDD2]">
              {Math.max(0, worker.dailyJobCap - worker.dailyJobsCompleted)} left
            </span>
          </div>
          <div className="mt-1.5 md:mt-2.5 flex items-baseline gap-1">
            <span className="text-[22px] md:text-[28px] font-[650] text-[#14181F] tabular-nums leading-none">
              {worker.dailyJobsCompleted}
            </span>
            <span className="text-[12px] md:text-[13px] text-[#6B7280] font-[500]">
              / {worker.dailyJobCap} max cap
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-xs">
          <span className="text-[12px] md:text-[13px] font-[500] text-[#6B7280]">Today's Payout</span>
          <div className="mt-1.5 md:mt-2.5">
            <span className="text-[22px] md:text-[28px] font-[650] text-[#14181F] tabular-nums leading-none">
              ₹{worker.todayPayout.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-3 sm:p-4 md:p-5 flex flex-col justify-between shadow-xs">
          <span className="text-[12px] md:text-[13px] font-[500] text-[#6B7280]">Acceptance</span>
          <div className="mt-1.5 md:mt-2.5 flex items-center gap-1">
            <span className="text-[22px] md:text-[28px] font-[650] text-[#14181F] tabular-nums leading-none">
              {worker.acceptanceRate}%
            </span>
            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-[#1F4D3D]" />
          </div>
        </div>
      </section>

      {/* Section Header: Available Job Broadcasts */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h3 className="text-[17px] md:text-[20px] font-[650] text-[#14181F] tracking-tight">
            Available Job Broadcasts
          </h3>
          <p className="text-[12px] md:text-[13px] text-[#6B7280]">
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

      {/* Offline state informative banner - does not block queue */}
      {!isOnline && (
        <div 
          id="offline-duty-banner"
          className="bg-[#FAFAF9] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-3.5 sm:p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#6B7280] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[13.5px] md:text-[14.5px] font-[650] text-[#14181F]">Offline Mode Active</h4>
              <p className="text-[12.5px] md:text-[13px] text-[#6B7280] mt-0.5 leading-relaxed">
                You appear offline to citizen apps. Your booking queue remains active below and you can accept or review any pending dispatches.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleOnline}
            className="self-start sm:self-center px-3.5 py-1.5 bg-[#1F4D3D] hover:bg-[#173C2F] text-[#FFFFFF] text-[12.5px] font-[600] rounded-[8px] transition-colors whitespace-nowrap min-h-[36px] flex items-center justify-center"
          >
            Go Online
          </button>
        </div>
      )}

      {/* Queue Clear State */}
      {incomingJobs.length === 0 && (
        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-8 md:p-12 text-center shadow-xs" id="queue-clear-state">
          <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-[#1F4D3D] mx-auto mb-2.5" />
          <h4 className="text-[15px] md:text-[17px] font-[650] text-[#14181F]">Queue Clear</h4>
          <p className="text-[13px] md:text-[14px] text-[#6B7280] mt-1 max-w-md mx-auto">
            No pending broadcast jobs in your immediate {worker.operationalRadiusKm} km sector right now.
            {!isOnline ? ' You will still see incoming booking dispatches here when requested.' : ' Keep your duty toggle on to receive incoming priority requests.'}
          </p>
        </div>
      )}

      {/* Job Cards Stack: 1 column on mobile, 2 columns on md, 3 columns on xl */}
      {incomingJobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5 md:gap-5" id="jobs-container">
          {incomingJobs.map((job) => {
            const isEmergency = job.urgency === 'Emergency';

            return (
              <article
                key={job.id}
                id={`job-card-${job.id}`}
                className="bg-[#FFFFFF] border border-[#E7E5E1] hover:border-[#1F4D3D]/40 rounded-[10px] md:rounded-[12px] p-4 sm:p-5 md:p-6 shadow-xs hover:shadow-sm transition-all duration-150 text-left flex flex-col justify-between"
              >
                <div>
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
                        {JOB_CATEGORY_LABELS[job.category]}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[20px] md:text-[22px] font-[650] text-[#14181F] tabular-nums leading-tight">
                        ₹{job.price.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        {job.priceType}
                      </div>
                    </div>
                  </div>

                  {/* Job Title & Description */}
                  <div 
                    className="mt-2.5 md:mt-3 cursor-pointer group"
                    onClick={() => onViewJobDetail(job)}
                    title="View full job details"
                  >
                    <h4 className="text-[16px] md:text-[17px] font-[650] text-[#14181F] group-hover:text-[#1F4D3D] transition-colors leading-snug">
                      {job.title}
                    </h4>
                    <p className="text-[13px] text-[#6B7280] mt-1 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  {/* Metadata Row: Location and Time */}
                  <div className="pt-3 border-t border-[#E7E5E1] flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#6B7280]">
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
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
