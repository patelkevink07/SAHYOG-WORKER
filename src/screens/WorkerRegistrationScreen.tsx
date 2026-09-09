import React, { useState, useRef, useEffect } from 'react';
import { 
  JobCategory, 
  JOB_CATEGORY_LABELS, 
  WorkerProfile 
} from '../types';
import { SahyogLogo } from '../components/SahyogLogo';
import { registerNewWorker, NewWorkerRegistrationInput } from '../lib/workerService';
import { compressImageFile } from '../lib/imageCompression';
import { 
  ArrowLeft, 
  Upload, 
  Camera, 
  ShieldCheck, 
  Check, 
  Plus, 
  X, 
  Wrench, 
  Zap, 
  Hammer, 
  Paintbrush, 
  Home, 
  HeartHandshake, 
  Truck, 
  Tv, 
  Flower2, 
  FileText, 
  CreditCard, 
  UserCheck, 
  Clock, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface WorkerRegistrationScreenProps {
  onSuccess: (newWorker: WorkerProfile) => void;
  onCancel: () => void;
}

const CATEGORY_ICONS: Record<JobCategory, React.ReactNode> = {
  'plumbing': <Wrench className="w-4 h-4 text-[#1F4D3D]" />,
  'electrical': <Zap className="w-4 h-4 text-[#C9A227]" />,
  'carpentry': <Hammer className="w-4 h-4 text-[#8B5E3C]" />,
  'painting': <Paintbrush className="w-4 h-4 text-[#2563EB]" />,
  'domestic-help': <Home className="w-4 h-4 text-[#059669]" />,
  'elder-care': <HeartHandshake className="w-4 h-4 text-[#DC2626]" />,
  'moving': <Truck className="w-4 h-4 text-[#7C3AED]" />,
  'appliance-repair': <Tv className="w-4 h-4 text-[#D97706]" />,
  'gardening': <Flower2 className="w-4 h-4 text-[#16A34A]" />,
  'general-repair': <Wrench className="w-4 h-4 text-[#4B5563]" />
};

const TRADE_SKILL_PRESETS: Record<JobCategory, string[]> = {
  'plumbing': ['Leakage Diagnostics', 'Sanitary Fixtures', 'CPVC Line Fitting', 'Water Heater Lines', 'Drain Clearance'],
  'electrical': ['Wiring & DB Fitting', 'Switchboard Repair', 'Inverter Installation', 'MCB Tripping Diagnostics', 'Earthing Test'],
  'carpentry': ['Door & Latch Repair', 'Modular Furniture Assembly', 'Hinge Adjustment', 'Wood Polishing', 'Concealed Shelving'],
  'painting': ['Interior Emulsion', 'Waterproofing Putty', 'Texture Wall Coating', 'Enamel Wood Primer', 'Ceiling Patching'],
  'domestic-help': ['Deep House Sanitization', 'Kitchen Degreasing', 'Floor Polishing', 'Balcony Cleaning', 'Appliance Scrubbing'],
  'elder-care': ['Mobility Assistance', 'Vital Signs Monitoring', 'Medication Reminders', 'Physiotherapy Support', 'Wheelchair Transfers'],
  'moving': ['Furniture Packing', 'Heavy Appliance Hoisting', 'Carton Packaging', 'Loading / Transit Tie-down', 'Unpacking Assembly'],
  'appliance-repair': ['AC Gas Recharging', 'Washing Machine Drum', 'Microwave Magnetron', 'Refrigerator Thermostat', 'RO Filter Replacement'],
  'gardening': ['Hedge Pruning', 'Organic Soil Fertilization', 'Potting & Repotting', 'Drip Irrigation Setup', 'Lawn Mowing'],
  'general-repair': ['Masonry Plastering', 'Drilling & Wall Hanging', 'Door Hardware Replacement', 'Silicone Sealing', 'Tile Patchwork']
};

const FEDERATION_OPTIONS = [
  'Delhi Shramik Federation',
  'Maharashtra Kamgar Mahasangh',
  'Karnataka Shramik Sahakari',
  'National Labour Cooperative Federation'
];

export const WorkerRegistrationScreen: React.FC<WorkerRegistrationScreenProps> = ({
  onSuccess,
  onCancel
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [primaryServiceId, setPrimaryServiceId] = useState<JobCategory>('plumbing');
  const [hourlyRate, setHourlyRate] = useState(380);
  const [federationName, setFederationName] = useState(FEDERATION_OPTIONS[0]);
  const [memberSinceYear, setMemberSinceYear] = useState(2026);
  const [summary, setSummary] = useState('');
  const [emergencyAvailable, setEmergencyAvailable] = useState(true);
  const [operationalRadiusKm, setOperationalRadiusKm] = useState(6.0);
  
  // Skills / Subservices
  const [subservices, setSubservices] = useState<string[]>(TRADE_SKILL_PRESETS['plumbing']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Certifications
  const [certifications, setCertifications] = useState<string[]>([
    'NCCT Cooperative Skills Grade-A',
    'NSDC National Skill Certification'
  ]);
  const [customCertInput, setCustomCertInput] = useState('');

  // Tools equipped
  const [toolsEquipped, setToolsEquipped] = useState<string[]>([
    'Professional Trade Toolset',
    'Safety Gear & Gloves',
    'Digital Measurement Gauge'
  ]);
  const [customToolInput, setCustomToolInput] = useState('');

  // Profile Photo
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // Mock Legal / Verification credentials (Pre-filled, fully editable)
  const [registrationNumber, setRegistrationNumber] = useState(`DSF-PLM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX-XXXX-8921');
  const [panNumber, setPanNumber] = useState('ABCDE1234F');
  const [bankAccount, setBankAccount] = useState('•••• •••• •••• 4519');
  const [ifscCode, setIfscCode] = useState('SBIN0001234');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-update default registration number and default preset skills when category changes
  const handleCategoryChange = (newCategory: JobCategory) => {
    setPrimaryServiceId(newCategory);
    const prefix = newCategory.slice(0, 3).toUpperCase();
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setRegistrationNumber(`DSF-${prefix}-2026-${suffix}`);
    // Update subservices to presets of the new category
    setSubservices(TRADE_SKILL_PRESETS[newCategory] || []);
  };

  // Photo upload and canvas compression handler
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingPhoto(true);
      setErrorMessage(null);
      // Downscale and compress to lightweight base64 data URL
      const compressedBase64 = await compressImageFile(file, 480, 0.7);
      setPhotoUrl(compressedBase64);
      setPhotoPreview(compressedBase64);
    } catch (err: any) {
      console.error('Error compressing profile photo:', err);
      setErrorMessage(err.message || 'Failed to compress selected photo. Please try a different image.');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Add skill tag
  const handleAddSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !subservices.includes(trimmed)) {
      setSubservices([...subservices, trimmed]);
      setCustomSkillInput('');
    }
  };

  // Remove skill tag
  const handleRemoveSkill = (skillToRemove: string) => {
    setSubservices(subservices.filter(s => s !== skillToRemove));
  };

  // Add certification tag
  const handleAddCert = () => {
    const trimmed = customCertInput.trim();
    if (trimmed && !certifications.includes(trimmed)) {
      setCertifications([...certifications, trimmed]);
      setCustomCertInput('');
    }
  };

  // Remove certification tag
  const handleRemoveCert = (certToRemove: string) => {
    setCertifications(certifications.filter(c => c !== certToRemove));
  };

  // Add tool tag
  const handleAddTool = () => {
    const trimmed = customToolInput.trim();
    if (trimmed && !toolsEquipped.includes(trimmed)) {
      setToolsEquipped([...toolsEquipped, trimmed]);
      setCustomToolInput('');
    }
  };

  // Remove tool tag
  const handleRemoveTool = (toolToRemove: string) => {
    setToolsEquipped(toolsEquipped.filter(t => t !== toolToRemove));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      setErrorMessage('Please enter your full legal name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMessage('Please enter a valid active phone number.');
      return;
    }
    if (subservices.length === 0) {
      setErrorMessage('Please add at least one trade skill or specialization.');
      return;
    }

    try {
      setIsSubmitting(true);

      const input: NewWorkerRegistrationInput = {
        name: name.trim(),
        phone: phone.trim(),
        primaryServiceId,
        primaryServiceName: JOB_CATEGORY_LABELS[primaryServiceId],
        subservices,
        hourlyRate: Number(hourlyRate) || 350,
        federationName,
        memberSinceYear,
        summary: summary.trim() || `Certified ${JOB_CATEGORY_LABELS[primaryServiceId]} partner registered with ${federationName}.`,
        certifications,
        toolsEquipped,
        emergencyAvailable,
        photoUrl,
        registrationNumber: registrationNumber.trim(),
        aadhaarNumber: aadhaarNumber.trim(),
        panNumber: panNumber.trim(),
        bankAccount: bankAccount.trim(),
        ifscCode: ifscCode.trim(),
        operationalRadiusKm: Number(operationalRadiusKm) || 5.0
      };

      const newWorkerProfile = await registerNewWorker(input);
      onSuccess(newWorkerProfile);
    } catch (err: any) {
      console.error('Registration failed:', err);
      setErrorMessage(err.message || 'Failed to submit registration. Please check your internet connection.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#14181F] flex flex-col items-center px-4 sm:px-6 md:px-8 py-6 md:py-10 antialiased">
      <div className="w-full max-w-3xl">
        {/* Top bar with back button & logo */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E7E5E1]">
          <button
            type="button"
            id="register-back-btn"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-[600] text-[#4B5563] hover:text-[#14181F] hover:bg-[#E7E5E1]/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Personas</span>
          </button>

          <div className="flex items-center gap-2">
            <SahyogLogo size="sm" />
            <span className="text-[12px] font-[700] uppercase tracking-wider text-[#1F4D3D] hidden sm:inline-block">
              Worker Self-Registration
            </span>
          </div>
        </div>

        {/* Title & introduction banner */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-[22px] sm:text-[26px] font-[700] text-[#14181F] tracking-tight">
              Register as New Worker
            </h1>
            <span className="px-2 py-0.5 rounded-[6px] bg-[#E8F5E9] text-[#166534] text-[11px] font-[700] uppercase tracking-wider border border-[#C8E6C9]">
              Cooperative Onboarding
            </span>
          </div>
          <p className="text-[14px] text-[#6B7280] mt-1 leading-relaxed">
            Create your federation credential document. Newly registered trade partners are submitted under <span className="font-semibold text-[#14181F]">Review Status ('pending')</span> to the federation mutual registry.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-[10px] bg-[#FEF2F2] border border-[#FCA5A5] flex items-start gap-3 text-[#991B1B] text-[13.5px]">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
            <button 
              type="button" 
              onClick={() => setErrorMessage(null)} 
              className="text-[#991B1B] hover:text-[#7F1D1D]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Identity & Photo */}
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[12px] p-5 md:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E7E5E1]">
              <UserCheck className="w-4 h-4 text-[#1F4D3D]" />
              <h2 className="text-[15px] font-[700] text-[#14181F]">1. Identity & Profile Photo</h2>
            </div>

            {/* Profile Photo Picker */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded-[12px] overflow-hidden bg-[#FAFAF9] border-2 border-dashed border-[#CBD5E1] flex items-center justify-center relative shadow-xs">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-[#9CA3AF]">
                      <Camera className="w-6 h-6" />
                      <span className="text-[9.5px] font-semibold mt-1">Photo</span>
                    </div>
                  )}
                  {isProcessingPhoto && (
                    <div className="absolute inset-0 bg-[#FFFFFF]/80 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#1F4D3D] border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-[13px] font-[600] text-[#14181F] mb-1">
                  Worker Portrait Photo
                </label>
                <p className="text-[12px] text-[#6B7280] mb-2.5">
                  Upload a clear face photo. It will be compressed client-side (max ~480px, JPEG) and saved directly in your profile.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="worker-photo-file-input"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    id="upload-photo-btn"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-[8px] bg-[#FAFAF9] border border-[#CBD5E1] hover:bg-[#FFFFFF] hover:border-[#1F4D3D] text-[12.5px] font-[600] text-[#14181F] transition-colors inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#1F4D3D]" />
                    <span>{photoPreview ? 'Change Photo' : 'Select Photo File'}</span>
                  </button>
                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoUrl('');
                        setPhotoPreview('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-2.5 py-1.5 rounded-[8px] text-[12px] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Name & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="worker-full-name" className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                  Full Legal Name <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="worker-full-name"
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chand Verma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[14px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:border-[#1F4D3D] transition-colors placeholder:text-[#9CA3AF]"
                />
              </div>

              <div>
                <label htmlFor="worker-phone" className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                  Mobile Phone Number <span className="text-[#DC2626]">*</span>
                </label>
                <input
                  id="worker-phone"
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[14px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:border-[#1F4D3D] transition-colors placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Primary Trade & Specializations */}
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[12px] p-5 md:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E7E5E1]">
              <Wrench className="w-4 h-4 text-[#1F4D3D]" />
              <h2 className="text-[15px] font-[700] text-[#14181F]">2. Trade & Skills Specialization</h2>
            </div>

            {/* Trade Category Picker (10 Canonical Categories) */}
            <div>
              <label className="block text-[13px] font-[600] text-[#14181F] mb-2">
                Primary Trade Category <span className="text-[#DC2626]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {(Object.keys(JOB_CATEGORY_LABELS) as JobCategory[]).map((catId) => {
                  const isSelected = primaryServiceId === catId;
                  return (
                    <button
                      key={catId}
                      type="button"
                      id={`trade-picker-${catId}`}
                      onClick={() => handleCategoryChange(catId)}
                      className={`p-2.5 rounded-[8px] border text-left flex flex-col items-start justify-between gap-1.5 transition-all duration-150 ${
                        isSelected 
                          ? 'bg-[#F4F9F6] border-[#1F4D3D] shadow-2xs ring-1 ring-[#1F4D3D]' 
                          : 'bg-[#FAFAF9] border-[#E7E5E1] hover:border-[#CBD5E1] hover:bg-[#FFFFFF]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="p-1 rounded-[6px] bg-[#FFFFFF] shadow-2xs">
                          {CATEGORY_ICONS[catId]}
                        </div>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#1F4D3D] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-[#FFFFFF] stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className={`text-[12px] font-[600] leading-snug ${
                        isSelected ? 'text-[#1F4D3D]' : 'text-[#374151]'
                      }`}>
                        {JOB_CATEGORY_LABELS[catId]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subservices / Skills multi-entry */}
            <div>
              <label className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                Subservices & Specialized Skills <span className="text-[#DC2626]">*</span>
              </label>
              <p className="text-[12px] text-[#6B7280] mb-2">
                Pills represent the skills matched with incoming citizen requests.
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {subservices.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#F3F4F6] text-[#14181F] text-[12px] font-[550] border border-[#E5E7EB]"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-[#6B7280] hover:text-[#DC2626]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Copper Braze, Drainage Snake, Inverter Line)"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-2 rounded-[8px] bg-[#1F4D3D] text-[#FFFFFF] text-[13px] font-[600] hover:bg-[#173C2F] transition-colors inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Hourly Rate & Operational Radius */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="worker-hourly-rate" className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                  Standard Hourly Rate (₹ / hr)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-[#6B7280] font-semibold text-[14px]">₹</span>
                  <input
                    id="worker-hourly-rate"
                    type="number"
                    min={150}
                    max={2000}
                    step={10}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full pl-8 pr-3.5 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[14px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="worker-radius" className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                  Operational Sector Radius: <span className="text-[#1F4D3D] font-bold">{operationalRadiusKm} km</span>
                </label>
                <input
                  id="worker-radius"
                  type="range"
                  min={2}
                  max={25}
                  step={0.5}
                  value={operationalRadiusKm}
                  onChange={(e) => setOperationalRadiusKm(Number(e.target.value))}
                  className="w-full accent-[#1F4D3D] mt-2.5"
                />
              </div>
            </div>

            {/* Emergency Dispatches Toggle */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1]">
              <div className="pr-3">
                <div className="text-[13px] font-[650] text-[#14181F]">Emergency & Night Dispatch Availability</div>
                <div className="text-[12px] text-[#6B7280] mt-0.5">
                  Receive high-priority emergency alerts with premium federation tariff rates.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={emergencyAvailable}
                onClick={() => setEmergencyAvailable(!emergencyAvailable)}
                className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] flex-shrink-0 ${
                  emergencyAvailable ? 'bg-[#1F4D3D]' : 'bg-[#CBD5E1]'
                }`}
              >
                <div className={`w-5 h-5 bg-[#FFFFFF] rounded-full shadow-sm transform transition-transform duration-200 ${
                  emergencyAvailable ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Summary / Bio */}
            <div>
              <label htmlFor="worker-summary" className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                Experience Summary / Bio
              </label>
              <textarea
                id="worker-summary"
                rows={3}
                placeholder="Brief summary of your professional trade background, years of work, and domain experience..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[13.5px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] placeholder:text-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Section 3: Accreditations, Tools & Federation Chapter */}
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[12px] p-5 md:p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E7E5E1]">
              <ShieldCheck className="w-4 h-4 text-[#1F4D3D]" />
              <h2 className="text-[15px] font-[700] text-[#14181F]">3. Cooperative Accreditations & Tooling</h2>
            </div>

            {/* Federation Chapter & Member Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="federation-chapter" className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                  Federation Chapter Affiliation
                </label>
                <select
                  id="federation-chapter"
                  value={federationName}
                  onChange={(e) => setFederationName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[13.5px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                >
                  {FEDERATION_OPTIONS.map((fed) => (
                    <option key={fed} value={fed}>{fed}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="member-year" className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                  Member Registration Year
                </label>
                <input
                  id="member-year"
                  type="number"
                  min={2000}
                  max={2030}
                  value={memberSinceYear}
                  onChange={(e) => setMemberSinceYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[14px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>
            </div>

            {/* Certifications multi-entry */}
            <div>
              <label className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                Accreditations & Certificates
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#E8F5E9] text-[#166534] text-[12px] font-[550] border border-[#C8E6C9]"
                  >
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(cert)}
                      className="text-[#166534] hover:text-[#DC2626]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add certificate (e.g. Government ITI Diploma, Level 3 Electrician)"
                  value={customCertInput}
                  onChange={(e) => setCustomCertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCert();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-3 py-2 rounded-[8px] bg-[#FAFAF9] border border-[#CBD5E1] text-[#14181F] text-[13px] font-[600] hover:bg-[#FFFFFF] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Tools Equipped multi-entry */}
            <div>
              <label className="block text-[13px] font-[600] text-[#14181F] mb-1.5">
                Tools & Equipment Equipped
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {toolsEquipped.map((tool) => (
                  <span
                    key={tool}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FAFAF9] text-[#4B5563] text-[12px] font-[550] border border-[#E7E5E1]"
                  >
                    <span>{tool}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTool(tool)}
                      className="text-[#6B7280] hover:text-[#DC2626]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tool (e.g. Digital Multimeter, Pipe Wrench 14-inch)"
                  value={customToolInput}
                  onChange={(e) => setCustomToolInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTool();
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FFFFFF] text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
                <button
                  type="button"
                  onClick={handleAddTool}
                  className="px-3 py-2 rounded-[8px] bg-[#FAFAF9] border border-[#CBD5E1] text-[#14181F] text-[13px] font-[600] hover:bg-[#FFFFFF] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Legal & Bank Verification Fields */}
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[12px] p-5 md:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1F4D3D]" />
                <h2 className="text-[15px] font-[700] text-[#14181F]">4. Legal & Settlement Credentials</h2>
              </div>
              <span className="text-[11px] font-semibold text-[#6B7280] bg-[#FAFAF9] px-2 py-0.5 rounded-[4px] border border-[#E7E5E1]">
                Pre-filled Plausible Data
              </span>
            </div>

            <p className="text-[12px] text-[#6B7280]">
              These credentials match the shared registry schema used by the Sahyog Admin review console. You can edit any field before submitting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-number" className="block text-[12.5px] font-[600] text-[#14181F] mb-1">
                  Federation Reg. ID
                </label>
                <input
                  id="reg-number"
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FAFAF9] font-mono text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div>
                <label htmlFor="aadhaar-number" className="block text-[12.5px] font-[600] text-[#14181F] mb-1">
                  Aadhaar Number (Masked)
                </label>
                <input
                  id="aadhaar-number"
                  type="text"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FAFAF9] font-mono text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div>
                <label htmlFor="pan-number" className="block text-[12.5px] font-[600] text-[#14181F] mb-1">
                  Income Tax PAN
                </label>
                <input
                  id="pan-number"
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FAFAF9] font-mono text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div>
                <label htmlFor="bank-account" className="block text-[12.5px] font-[600] text-[#14181F] mb-1">
                  Settlement Bank Account
                </label>
                <input
                  id="bank-account"
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FAFAF9] font-mono text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="ifsc-code" className="block text-[12.5px] font-[600] text-[#14181F] mb-1">
                  Bank IFSC Code
                </label>
                <input
                  id="ifsc-code"
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] border border-[#CBD5E1] bg-[#FAFAF9] font-mono text-[13px] text-[#14181F] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D]"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              id="submit-worker-registration-btn"
              disabled={isSubmitting}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-[10px] bg-[#1F4D3D] text-[#FFFFFF] font-[650] text-[15px] hover:bg-[#173C2F] disabled:opacity-60 transition-all duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#FFFFFF] border-t-transparent rounded-full animate-spin" />
                  <span>Submitting to Federation Registry...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Submit Application & Enter Portal</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="cancel-worker-registration-btn"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full sm:w-auto py-3.5 px-6 rounded-[10px] bg-[#FAFAF9] border border-[#CBD5E1] text-[#4B5563] font-[600] text-[14px] hover:bg-[#FFFFFF] hover:text-[#14181F] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
