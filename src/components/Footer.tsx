import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="mt-12 mb-20 md:mb-8 pt-6 border-t border-[#E7E5E1] text-center px-4">
      <p className="text-[12px] md:text-[13px] font-[500] text-[#6B7280]">
        Sahyog Worker Operational Mesh · Delhi Shramik Cooperative Union
      </p>
      <div className="mt-1.5">
        <a
          href="https://sahyogcitizen.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          id="footer-book-service-link"
          className="text-[13px] md:text-[14px] font-[600] text-[#1F4D3D] hover:underline inline-flex items-center gap-1 focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] rounded-[4px]"
        >
          Book a service →
        </a>
      </div>
    </footer>
  );
};
