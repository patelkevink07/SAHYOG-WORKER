import React, { useState } from 'react';
import { SahyogLogo } from '../components/SahyogLogo';
import { Lock, Phone, CreditCard, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [method, setMethod] = useState<'phone' | 'coopId'>('coopId');
  const [coopId, setCoopId] = useState('REG-DL-8841');
  const [pin, setPin] = useState('4402');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('8841');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (method === 'coopId') {
      if (!coopId.trim() || !pin.trim()) {
        setErrorMessage('Please enter both Member ID and PIN.');
        return;
      }
      onLoginSuccess();
    } else {
      if (!otpSent) {
        if (!phone.trim() || phone.length < 10) {
          setErrorMessage('Please enter a valid 10-digit mobile number.');
          return;
        }
        setOtpSent(true);
        setOtp('8841');
      } else {
        if (!otp.trim()) {
          setErrorMessage('Please enter the 4-digit OTP.');
          return;
        }
        onLoginSuccess();
      }
    }
  };

  const handleQuickDemoFill = (presetId: 'ramesh' | 'priya') => {
    if (presetId === 'ramesh') {
      setMethod('coopId');
      setCoopId('REG-DL-8841');
      setPin('4402');
    } else {
      setMethod('phone');
      setPhone('9810123456');
      setOtp('1234');
      setOtpSent(true);
    }
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col justify-center items-center px-4 py-8">
      {/* Centered Minimal Container */}
      <div className="w-full max-w-sm">
        {/* Brand mark */}
        <div className="flex flex-col items-center text-center mb-6">
          <SahyogLogo size="lg" />
          <h1 className="text-[22px] font-[650] text-[#14181F] mt-3 tracking-tight">
            Sahyog Worker
          </h1>
          <p className="text-[13px] font-[400] text-[#6B7280] mt-0.5">
            Cooperative Partner Portal · SIH26089
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-6 shadow-xs">
          {/* Method Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] mb-5">
            <button
              type="button"
              id="login-tab-coop"
              onClick={() => {
                setMethod('coopId');
                setErrorMessage('');
              }}
              className={`h-9 text-[13px] font-[600] rounded-[6px] transition-colors flex items-center justify-center gap-1.5 ${
                method === 'coopId'
                  ? 'bg-[#FFFFFF] text-[#14181F] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Member ID
            </button>
            <button
              type="button"
              id="login-tab-phone"
              onClick={() => {
                setMethod('phone');
                setErrorMessage('');
              }}
              className={`h-9 text-[13px] font-[600] rounded-[6px] transition-colors flex items-center justify-center gap-1.5 ${
                method === 'phone'
                  ? 'bg-[#FFFFFF] text-[#14181F] shadow-xs'
                  : 'text-[#6B7280] hover:text-[#14181F]'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              Phone OTP
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-[13px] rounded-[8px]">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {method === 'coopId' ? (
              <>
                <div>
                  <label 
                    htmlFor="coop-member-id" 
                    className="block text-[13px] font-[500] text-[#14181F] mb-1.5"
                  >
                    Cooperative Member ID
                  </label>
                  <input
                    id="coop-member-id"
                    type="text"
                    required
                    value={coopId}
                    onChange={(e) => setCoopId(e.target.value)}
                    placeholder="e.g. REG-DL-8841"
                    className="w-full h-12 px-3.5 bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] text-[14px] text-[#14181F] font-mono tracking-wide placeholder:text-[#6B7280] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:border-transparent transition-colors"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="coop-pin" 
                    className="block text-[13px] font-[500] text-[#14181F] mb-1.5"
                  >
                    Security PIN
                  </label>
                  <input
                    id="coop-pin"
                    type="password"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="4 or 6 digit PIN"
                    className="w-full h-12 px-3.5 bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] text-[15px] text-[#14181F] font-mono tracking-widest placeholder:text-[#6B7280] placeholder:tracking-normal focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:border-transparent transition-colors"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label 
                    htmlFor="worker-phone" 
                    className="block text-[13px] font-[500] text-[#14181F] mb-1.5"
                  >
                    Registered Mobile Number
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3 border border-r-0 border-[#E7E5E1] bg-[#FAFAF9] text-[#6B7280] text-[14px] rounded-l-[10px] tabular-nums font-medium">
                      +91
                    </span>
                    <input
                      id="worker-phone"
                      type="tel"
                      maxLength={10}
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full h-12 px-3.5 bg-[#FFFFFF] border border-[#E7E5E1] rounded-r-[10px] text-[14px] text-[#14181F] tabular-nums placeholder:text-[#6B7280] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label 
                        htmlFor="worker-otp" 
                        className="block text-[13px] font-[500] text-[#14181F]"
                      >
                        Enter 4-Digit OTP
                      </label>
                      <span className="text-[11px] text-[#15803D] font-medium">
                        Code sent: 8841
                      </span>
                    </div>
                    <input
                      id="worker-otp"
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="e.g. 8841"
                      className="w-full h-12 px-3.5 bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] text-[16px] text-[#14181F] font-mono tracking-widest placeholder:text-[#6B7280] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:border-transparent transition-colors"
                    />
                  </div>
                )}
              </>
            )}

            <button
              id="login-submit-btn"
              type="submit"
              className="w-full min-h-[48px] h-12 bg-[#1F4D3D] hover:bg-[#173C2F] text-[#FFFFFF] font-[600] text-[14px] rounded-[8px] flex items-center justify-center gap-2 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:ring-offset-2 select-none"
            >
              <span>{method === 'phone' && !otpSent ? 'Send OTP' : 'Log In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick preset for evaluation */}
          <div className="mt-5 pt-4 border-t border-[#E7E5E1]">
            <p className="text-[11px] font-[500] text-[#6B7280] mb-2 text-center uppercase tracking-wide">
              Quick member login
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                id="quick-login-ramesh"
                onClick={() => {
                  handleQuickDemoFill('ramesh');
                  onLoginSuccess();
                }}
                className="flex-1 h-9 bg-[#FAFAF9] hover:bg-[#E7E5E1]/50 border border-[#E7E5E1] rounded-[8px] text-[12px] font-[600] text-[#14181F] transition-colors"
              >
                Ramesh C. (Plumber)
              </button>
              <button
                type="button"
                id="quick-login-phone"
                onClick={() => {
                  handleQuickDemoFill('priya');
                  onLoginSuccess();
                }}
                className="flex-1 h-9 bg-[#FAFAF9] hover:bg-[#E7E5E1]/50 border border-[#E7E5E1] rounded-[8px] text-[12px] font-[600] text-[#14181F] transition-colors"
              >
                One-tap Phone
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Footer Info */}
        <div className="mt-6 text-center text-[12px] text-[#6B7280]">
          <p>National Labour Cooperative Federation · SIH26089</p>
        </div>
      </div>
    </div>
  );
};
