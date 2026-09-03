import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <footer id="app-footer" className="mt-12 mb-20 pt-6 border-t border-[#E7E5E1] text-center px-4">
        <p className="text-[12px] font-[500] text-[#6B7280]">
          Sahyog Worker Operational Mesh · Delhi Shramik Cooperative Union
        </p>
        <div className="mt-1.5">
          <button
            onClick={() => setShowModal(true)}
            id="footer-book-service-link"
            className="text-[13px] font-[600] text-[#1F4D3D] hover:underline inline-flex items-center gap-1 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] rounded-[4px]"
          >
            Book a service →
          </button>
        </div>
      </footer>

      {showModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-6 max-w-sm w-full shadow-xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] font-semibold tracking-wider text-[#6B7280] uppercase">
              Companion App
            </span>
            <h3 className="text-[18px] font-[650] text-[#14181F] mt-1 mb-2">
              Sahyog Citizen Portal
            </h3>
            <p className="text-[14px] text-[#6B7280] leading-relaxed mb-4">
              Citizen bookings are managed through the citizen portal at <code className="text-[#14181F] font-mono text-[12px] bg-[#FAFAF9] px-1.5 py-0.5 rounded border border-[#E7E5E1]">sahyog-citizen</code>. As a registered cooperative partner, you are currently in the dedicated worker operational app.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full h-11 bg-[#1F4D3D] hover:bg-[#173C2F] text-white font-[600] text-[14px] rounded-[8px] transition-colors"
              >
                Return to Worker App
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
