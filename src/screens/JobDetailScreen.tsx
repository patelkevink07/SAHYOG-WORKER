import React from 'react';
import { JobRequest } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Navigation,
  FileText
} from 'lucide-react';

interface JobDetailScreenProps {
  job: JobRequest;
  onBack: () => void;
  onAccept: (job: JobRequest) => void;
  onReject: (jobId: string) => void;
}

export const JobDetailScreen: React.FC<JobDetailScreenProps> = ({
  job,
  onBack,
  onAccept,
  onReject
}) => {
  const isEmergency = job.urgency === 'Emergency';

  return (
    <div className="space-y-4 pb-12">
      {/* Top back navigation bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          id="job-detail-back-btn"
          className="min-h-[44px] inline-flex items-center gap-2 text-[14px] font-[600] text-[#1F4D3D] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] rounded-[6px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to broadcast queue</span>
        </button>
        <span className="text-[12px] font-mono text-[#6B7280]">
          ID #{job.id.toUpperCase()}
        </span>
      </div>

      {/* Main Detail Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 sm:p-6 shadow-xs text-left">
        {/* Header Tags & Payout */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E7E5E1] gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {isEmergency ? (
                <span className="px-2.5 py-0.5 rounded-[8px] bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-[12px] font-[600] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Emergency Dispatch
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-[#14181F] text-[12px] font-[600]">
                  {job.urgencyLabel || 'Standard Booking'}
                </span>
              )}
              <span className="text-[12px] text-[#6B7280]">
                {job.category}
              </span>
            </div>
            <h2 className="text-[20px] font-[650] text-[#14181F] leading-tight">
              {job.title}
            </h2>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[24px] font-[650] text-[#14181F] tabular-nums leading-tight">
              ₹{job.price.toLocaleString('en-IN')}
            </span>
            <span className="block text-[11px] text-[#6B7280]">
              {job.priceType}
            </span>
          </div>
        </div>

        {/* Location & Navigation Section */}
        <div className="py-4 border-b border-[#E7E5E1] space-y-3">
          <div className="bg-[#FAFAF9] border border-[#E7E5E1] rounded-[10px] p-4 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#1F4D3D] flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-[600] uppercase tracking-wider text-[#6B7280]">
                Site Location ({job.distanceKm} km away)
              </span>
              <p className="text-[14px] font-[600] text-[#14181F] mt-0.5">
                {job.address}
              </p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Sector: {job.area} · Estimated transit: 12-15 mins
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3 bg-[#FFFFFF] border border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F] text-[13px] font-[600] rounded-[8px] flex items-center gap-1.5 flex-shrink-0 transition-colors"
            >
              <Navigation className="w-4 h-4 text-[#1F4D3D]" />
              <span>Map</span>
            </a>
          </div>

          {/* Time Window */}
          <div className="flex items-center gap-2 text-[13px] text-[#14181F]">
            <Clock className="w-4 h-4 text-[#6B7280]" />
            <span>Required arrival window: <strong className="font-[600]">{job.timeWindow}</strong></span>
          </div>
        </div>

        {/* Citizen Client Contact */}
        <div className="py-4 border-b border-[#E7E5E1]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-[600] uppercase tracking-wider text-[#6B7280]">
                Citizen Client
              </span>
              <p className="text-[15px] font-[650] text-[#14181F]">
                {job.customerName}
              </p>
            </div>
            <span className="text-[12px] text-[#15803D] font-[500] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              Verified Resident
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${job.customerPhone}`}
              id="job-detail-call-btn"
              className="min-h-[48px] h-12 bg-[#FFFFFF] border border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F] font-[600] text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#1F4D3D]" />
              <span>Call Citizen</span>
            </a>
            <button
              type="button"
              id="job-detail-msg-btn"
              onClick={() => alert(`Direct cooperative text line opened with ${job.customerName}.`)}
              className="min-h-[48px] h-12 bg-[#FFFFFF] border border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F] font-[600] text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#1F4D3D]" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* Customer Notes & Scope Description */}
        <div className="py-4 border-b border-[#E7E5E1] space-y-3">
          <div>
            <h4 className="text-[13px] font-[650] text-[#14181F] flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#6B7280]" />
              Customer Issue Description
            </h4>
            <p className="text-[14px] text-[#14181F] mt-1 bg-[#FAFAF9] p-3 rounded-[8px] border border-[#E7E5E1]">
              {job.description}
            </p>
          </div>

          {job.notes && (
            <div>
              <span className="text-[12px] font-[600] text-[#6B7280]">
                Field Notes & Material Details:
              </span>
              <p className="text-[13px] text-[#6B7280] mt-0.5">
                {job.notes}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 text-[12px] text-[#14181F]">
            <CheckCircle2 className="w-4 h-4 text-[#1F4D3D]" />
            <span>
              {job.materialsProvided 
                ? 'Standard parts/materials already purchased on-site by resident.' 
                : 'Worker supplies standard consumable parts billed as per Cooperative Price Schedule.'}
            </span>
          </div>
        </div>

        {/* Cooperative Tariff Breakdown (Zero Commission Model) */}
        <div className="py-4">
          <h4 className="text-[13px] font-[650] text-[#14181F] mb-2">
            Settlement Breakdown (Cooperative Transparency)
          </h4>
          <div className="bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] p-3.5 space-y-2 text-[13px]">
            <div className="flex justify-between text-[#14181F]">
              <span>Agreed Tariff</span>
              <span className="font-semibold tabular-nums">₹{job.price}</span>
            </div>
            <div className="flex justify-between text-[#15803D]">
              <span>Cooperative Platform Fee (Civic)</span>
              <span className="font-semibold tabular-nums">₹0 (0% Cut)</span>
            </div>
            <div className="flex justify-between text-[#6B7280]">
              <span>Solidarity Welfare & Escrow contribution</span>
              <span className="tabular-nums">-₹10</span>
            </div>
            <div className="pt-2 border-t border-[#E7E5E1] flex justify-between font-[650] text-[15px] text-[#1F4D3D]">
              <span>Your Net Payout</span>
              <span className="tabular-nums">₹{job.price - 10}</span>
            </div>
          </div>
        </div>

        {/* Big Action Buttons (48px minimum height) */}
        <div className="mt-4 pt-4 border-t border-[#E7E5E1] grid grid-cols-2 gap-3">
          <button
            type="button"
            id="job-detail-pass-btn"
            onClick={() => {
              onReject(job.id);
              onBack();
            }}
            className="min-h-[48px] h-12 border border-[#E7E5E1] bg-[#FFFFFF] hover:bg-[#FAFAF9] text-[#14181F] font-[600] text-[14px] rounded-[8px] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
          >
            Pass
          </button>
          <button
            type="button"
            id="job-detail-accept-btn"
            onClick={() => onAccept(job)}
            className="min-h-[48px] h-12 bg-[#1F4D3D] hover:bg-[#173C2F] text-[#FFFFFF] font-[600] text-[14px] rounded-[8px] transition-colors flex items-center justify-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 shadow-xs"
          >
            <span>Accept Job</span>
          </button>
        </div>
      </div>
    </div>
  );
};
