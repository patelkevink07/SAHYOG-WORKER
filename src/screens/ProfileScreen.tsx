import React, { useState } from 'react';
import { WorkerProfile } from '../types';
import { 
  Shield, 
  Check, 
  Phone, 
  FileText, 
  Award, 
  ExternalLink, 
  LogOut, 
  MapPin, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProfileScreenProps {
  worker: WorkerProfile;
  onUpdateRadius: (radius: number) => void;
  onLogout: () => void;
  onViewReviews: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  worker,
  onUpdateRadius,
  onLogout,
  onViewReviews
}) => {
  const [radius, setRadius] = useState(worker.operationalRadiusKm);
  const [showRadiusSaved, setShowRadiusSaved] = useState(false);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    onUpdateRadius(newRadius);
    setShowRadiusSaved(true);
    setTimeout(() => setShowRadiusSaved(false), 2000);
  };

  return (
    <div className="space-y-4 pb-12 text-left">
      {/* Worker Profile Header Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#1F4D3D] text-[#FFFFFF] flex items-center justify-center font-[700] text-[22px] ring-2 ring-[#E7E5E1] flex-shrink-0">
            {worker.avatarInitials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-[650] text-[#14181F] leading-tight">
                {worker.name}
              </h2>

              {/* EXACT VERIFICATION CHIP STYLE: Gold checkmark + "Verified · [Federation name]" in muted text */}
              <span 
                id="profile-verification-chip"
                className="px-2.5 py-0.5 rounded-[8px] bg-[#FDF8E8] border border-[#F3E8B6] text-[#755B00] text-[12px] font-[600] inline-flex items-center gap-1.5"
              >
                <span className="w-4 h-4 rounded-full bg-[#C9A227] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3px]" />
                </span>
                <span>Verified · {worker.federationName}</span>
              </span>
            </div>

            <p className="text-[14px] text-[#6B7280] mt-1 font-[400]">
              {worker.trade} · {worker.certificationLevel}
            </p>

            <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6B7280] mt-2">
              <span>Coop ID: <strong className="text-[#14181F] font-mono">{worker.memberId}</strong></span>
              <span>•</span>
              <span>NCCT Member Since: <strong className="text-[#14181F] font-[600]">{worker.memberSinceYear}</strong></span>
              <span>•</span>
              <button 
                onClick={onViewReviews}
                className="text-[#1F4D3D] font-[600] hover:underline"
              >
                Rating: {worker.rating.toFixed(2)} ({worker.reviewCount} reviews)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Federation Standing & Credentials Bento */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 sm:p-6 shadow-xs">
        <h3 className="text-[16px] font-[650] text-[#14181F] mb-4">
          Federation Standing & Credentials
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Police Verification */}
          <div className="p-4 border border-[#E7E5E1] rounded-[10px] bg-[#FAFAF9]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-[600] text-[#14181F]">Police Verification</span>
              <span className="px-2 py-0.5 rounded-[8px] bg-[#F0FDF4] text-[#166534] text-[11px] font-[600]">
                {worker.policeVerificationStatus}
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              {worker.policeVerificationDetails}
            </p>
          </div>

          {/* Skill Trade Certification */}
          <div className="p-4 border border-[#E7E5E1] rounded-[10px] bg-[#FAFAF9]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-[600] text-[#14181F]">Skill Trade Certification</span>
              <span className="px-2 py-0.5 rounded-[8px] bg-[#F0FDF4] text-[#166534] text-[11px] font-[600]">
                LEVEL 4
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              {worker.skillCertificationDetails}
            </p>
          </div>

          {/* NCCT Standing */}
          <div className="p-4 border border-[#E7E5E1] rounded-[10px] bg-[#FAFAF9]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-[600] text-[#14181F]">NCCT Standing</span>
              <span className="px-2 py-0.5 rounded-[8px] bg-[#F0FDF4] text-[#166534] text-[11px] font-[600]">
                {worker.ncctStanding}
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed">
              {worker.ncctDetails}
            </p>
          </div>

          {/* Operational Radius with Controls */}
          <div className="p-4 border border-[#E7E5E1] rounded-[10px] bg-[#FAFAF9]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[13px] font-[600] text-[#14181F]">Operational Radius</span>
              <span className="px-2 py-0.5 rounded-[8px] bg-[#FFFFFF] border border-[#E7E5E1] text-[#14181F] text-[11px] font-[600] tabular-nums">
                {radius.toFixed(1)} KM
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280] leading-relaxed mb-2.5">
              Primary assigned sectors: Mayur Vihar, IP Extension, Preet Vihar, Laxmi Nagar.
            </p>
            <div className="flex items-center gap-2">
              {[4.0, 6.0, 8.0, 10.0].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleRadiusChange(r)}
                  className={`min-h-[36px] px-2.5 py-1 rounded-[6px] text-[11px] font-[600] tabular-nums transition-colors ${
                    radius === r
                      ? 'bg-[#1F4D3D] text-[#FFFFFF]'
                      : 'bg-[#FFFFFF] border border-[#E7E5E1] text-[#14181F] hover:bg-[#FAFAF9]'
                  }`}
                >
                  {r} km
                </button>
              ))}
              {showRadiusSaved && (
                <span className="text-[11px] text-[#15803D] font-[500] ml-1">
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verified Documents Checklist */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 shadow-xs">
        <h3 className="text-[15px] font-[650] text-[#14181F] mb-3">
          Verified Legal & Banking Documents
        </h3>
        <div className="divide-y divide-[#E7E5E1] text-[13px]">
          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span className="font-[500] text-[#14181F]">Aadhaar Biometric KYC</span>
            </div>
            <span className="text-[11px] text-[#6B7280] font-mono">UIDAI Verified · Dec 2021</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span className="font-[500] text-[#14181F]">Labour Cooperative Trade Permit</span>
            </div>
            <span className="text-[11px] text-[#6B7280] font-mono">#DL-SHR-2021-998</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
              <span className="font-[500] text-[#14181F]">Bank Direct Settlement NEFT</span>
            </div>
            <span className="text-[11px] text-[#6B7280] font-mono">HDFC Bank ****4102</span>
          </div>
        </div>
      </div>

      {/* Trade Skills Badges */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 shadow-xs">
        <h3 className="text-[15px] font-[650] text-[#14181F] mb-3">
          Verified Trade Competencies
        </h3>
        <div className="flex flex-wrap gap-2">
          {worker.skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-[#FAFAF9] border border-[#E7E5E1] text-[#14181F] text-[12px] font-[500] rounded-[8px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Federation SOS / Desk Support */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-[14px] font-[650] text-[#14181F]">
            Federation Help & SOS Dispatcher
          </h4>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Direct phone assistance for field safety, tooling disputes, or escrow queries
          </p>
        </div>
        <a
          href="tel:1800112233"
          className="min-h-[44px] px-4 bg-[#FFFFFF] border border-[#E7E5E1] hover:bg-[#FAFAF9] text-[#14181F] rounded-[8px] text-[13px] font-[600] inline-flex items-center justify-center gap-2 transition-colors flex-shrink-0"
        >
          <Phone className="w-4 h-4 text-[#1F4D3D]" />
          <span>Federation Desk (1800-11-2233)</span>
        </a>
      </div>

      {/* Logout Action */}
      <div className="pt-2">
        <button
          type="button"
          id="profile-logout-btn"
          onClick={onLogout}
          className="w-full min-h-[48px] h-12 border border-[#E7E5E1] bg-[#FFFFFF] hover:bg-[#FAFAF9] text-[#991B1B] font-[600] text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of Session</span>
        </button>
      </div>
    </div>
  );
};
