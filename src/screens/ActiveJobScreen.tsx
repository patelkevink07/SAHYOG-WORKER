import React, { useState } from 'react';
import { ActiveJobSession, StepState } from '../types';
import { 
  Check, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Navigation, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Wrench, 
  ShieldCheck, 
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface ActiveJobScreenProps {
  activeSession: ActiveJobSession | null;
  onAdvanceStep: () => void;
  onCompleteJob: () => void;
  onToggleChecklistItem: (itemId: string) => void;
  onReturnToJobs: () => void;
}

export const ActiveJobScreen: React.FC<ActiveJobScreenProps> = ({
  activeSession,
  onAdvanceStep,
  onCompleteJob,
  onToggleChecklistItem,
  onReturnToJobs
}) => {
  const [completionNotes, setCompletionNotes] = useState('');

  if (!activeSession) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-8 text-center my-8">
        <ClipboardList className="w-10 h-10 text-[#6B7280] mx-auto mb-3" />
        <h3 className="text-[17px] font-[650] text-[#14181F]">No active job</h3>
        <p className="text-[13px] text-[#6B7280] mt-1 max-w-sm mx-auto">
          You do not have a service currently in execution. Accept a broadcast request to begin work.
        </p>
        <button
          onClick={onReturnToJobs}
          className="mt-4 min-h-[48px] px-6 bg-[#1F4D3D] hover:bg-[#173C2F] text-[#FFFFFF] text-[14px] font-[600] rounded-[8px] transition-colors inline-flex items-center gap-2"
        >
          <span>View Available Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const { job, currentStep, checklist } = activeSession;

  const steps = [
    { num: 1, label: 'On the way', verb: 'Confirm Arrival' },
    { num: 2, label: 'Arrived', verb: 'Start job' },
    { num: 3, label: 'In progress', verb: 'Mark complete' },
    { num: 4, label: 'Completed', verb: 'Return to Jobs' }
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="space-y-4 pb-12 text-left">
      {/* Active Job Card Container */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 sm:p-6 shadow-xs">
        {/* Job Header Meta */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E7E5E1] gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-[8px] bg-[#1F4D3D] text-[#FFFFFF] text-[11px] font-[600] tracking-wide">
                {currentStep === 4 ? 'JOB COMPLETED' : 'IN EXECUTION'}
              </span>
              <span className="text-[12px] font-mono text-[#6B7280]">
                #{job.id.toUpperCase()}
              </span>
            </div>
            <h3 className="text-[18px] font-[650] text-[#14181F] leading-tight">
              {job.title}
            </h3>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Citizen: <strong className="text-[#14181F] font-[600]">{job.customerName}</strong>
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-[22px] font-[650] text-[#14181F] tabular-nums leading-tight">
              ₹{job.price.toLocaleString('en-IN')}
            </span>
            <span className="block text-[11px] text-[#6B7280]">
              Coop Standard Tariff
            </span>
          </div>
        </div>

        {/* STEPPER PROGRESSION - 4 Stages with One-Tap Advance */}
        <div className="py-6 border-b border-[#E7E5E1]">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px] font-[650] text-[#14181F]">
              Service Timeline
            </h4>
            <span id="step-indicator-text" className="text-[12px] font-[600] text-[#1F4D3D]">
              Step {currentStep} of 4: {currentStepData.label}
            </span>
          </div>

          {/* Stepper Graphic */}
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            {steps.map((s) => {
              const isPast = s.num < currentStep;
              const isCurrent = s.num === currentStep;

              return (
                <div key={s.num} className="flex flex-col items-center">
                  <div 
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mb-1.5 transition-all ${
                      isPast 
                        ? 'bg-[#1F4D3D] text-[#FFFFFF]' 
                        : isCurrent 
                        ? 'bg-[#1F4D3D] text-[#FFFFFF] ring-3 ring-[#1F4D3D]/25 ring-offset-2' 
                        : 'bg-[#FAFAF9] border border-[#E7E5E1] text-[#6B7280]'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-4 h-4 stroke-[2.6px]" />
                    ) : (
                      <span className="tabular-nums text-[13px]">{s.num}</span>
                    )}
                  </div>
                  <span className={`leading-tight ${isCurrent ? 'font-[650] text-[#1F4D3D]' : isPast ? 'font-[500] text-[#14181F]' : 'text-[#6B7280]'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location & Navigation Block */}
        <div className="py-4 border-b border-[#E7E5E1] space-y-3">
          <div className="flex items-start gap-3 bg-[#FAFAF9] p-3.5 rounded-[10px] border border-[#E7E5E1]">
            <MapPin className="w-5 h-5 text-[#1F4D3D] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-[650] text-[#14181F]">
                {job.address}
              </p>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Sector: {job.area} ({job.distanceKm} km from hub)
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] px-3 bg-[#FFFFFF] border border-[#E7E5E1] text-[#14181F] hover:bg-[#FAFAF9] rounded-[8px] text-[12px] font-[600] flex items-center gap-1.5 flex-shrink-0 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#1F4D3D]" />
              <span>Navigate</span>
            </a>
          </div>

          {/* Quick Communication Actions (48px tap targets) */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${job.customerPhone}`}
              className="min-h-[48px] h-12 bg-[#FFFFFF] border border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F] font-[600] text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#1F4D3D]" />
              <span>Call Citizen</span>
            </a>
            <button
              type="button"
              onClick={() => alert(`Connecting direct SMS/chat dispatch with ${job.customerName}...`)}
              className="min-h-[48px] h-12 bg-[#FFFFFF] border border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F] font-[600] text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#1F4D3D]" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* Standard Cooperative Field Checklist */}
        <div className="py-4 border-b border-[#E7E5E1]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[13px] font-[650] text-[#14181F]">
              Job Protocol Checklist
            </h4>
            <span className="text-[11px] text-[#6B7280]">
              NCCT Standards
            </span>
          </div>

          <div className="space-y-2">
            {checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggleChecklistItem(item.id)}
                className="w-full min-h-[44px] flex items-start gap-2.5 p-2 rounded-[8px] text-left hover:bg-[#FAFAF9] transition-colors focus:outline-hidden focus:ring-1 focus:ring-[#1F4D3D]"
              >
                {item.done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1F4D3D] mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                )}
                <span className={`text-[13px] leading-snug ${item.done ? 'line-through text-[#6B7280]' : 'text-[#14181F]'}`}>
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4 Completed State View */}
        {currentStep === 4 && (
          <div className="py-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] p-4 text-center my-3">
            <CheckCircle2 className="w-8 h-8 text-[#15803D] mx-auto mb-1.5" />
            <h4 className="text-[16px] font-[650] text-[#14181F]">Job Completed</h4>
            <p className="text-[13px] text-[#166534] mt-0.5">
              ₹{job.price.toLocaleString('en-IN')} has been added to your current week settlement ledger.
            </p>
          </div>
        )}

        {/* PRIMARY EXECUTION ADVANCE ACTION BUTTON (48px height) */}
        <div className="pt-4">
          <button
            id="advance-step-btn"
            type="button"
            onClick={() => {
              if (currentStep < 4) {
                onAdvanceStep();
              } else {
                onCompleteJob();
              }
            }}
            className="w-full min-h-[48px] h-12 bg-[#1F4D3D] hover:bg-[#173C2F] text-[#FFFFFF] font-[600] text-[15px] rounded-[8px] transition-colors flex items-center justify-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 shadow-xs"
          >
            <span>{currentStepData.verb}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
