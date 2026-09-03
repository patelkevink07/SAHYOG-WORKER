import React from 'react';
import { CustomerReview, WorkerProfile } from '../types';
import { Star, ArrowLeft, ShieldCheck, ThumbsUp } from 'lucide-react';

interface ReviewsScreenProps {
  worker: WorkerProfile;
  reviews: CustomerReview[];
  onBack: () => void;
}

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({
  worker,
  reviews,
  onBack
}) => {
  const topPraiseTags = [
    { label: 'Prompt Arrival', count: 184 },
    { label: 'Fair Federation Tariff', count: 172 },
    { label: 'Clean Work Site', count: 156 },
    { label: 'Transparent Advice', count: 140 },
    { label: 'Respectful Demeanor', count: 128 }
  ];

  return (
    <div className="space-y-4 pb-12 text-left">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-[14px] font-[600] text-[#1F4D3D] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] rounded-[6px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-[12px] text-[#6B7280]">
          Read-Only Citizen Feedback
        </span>
      </div>

      {/* Aggregate Rating Overview Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E5E1]">
          <div>
            <span className="text-[12px] font-[500] text-[#6B7280]">
              Overall Performance Rating
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[36px] font-[650] text-[#14181F] tabular-nums leading-none">
                {(worker?.rating ?? 4.92).toFixed(2)}
              </span>
              <span className="text-[16px] text-[#6B7280] font-[500]">
                / 5.0
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[#C9A227] text-[#C9A227]" />
              ))}
              <span className="text-[13px] text-[#6B7280] ml-1.5 tabular-nums font-[500]">
                Based on {worker.reviewCount} verified citizen bookings
              </span>
            </div>
          </div>

          <div className="space-y-1.5 w-full sm:w-48 text-[11px] text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-8 tabular-nums">5 star</span>
              <div className="flex-1 bg-[#FAFAF9] border border-[#E7E5E1] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1F4D3D] h-full w-[94%]" />
              </div>
              <span className="tabular-nums">94%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 tabular-nums">4 star</span>
              <div className="flex-1 bg-[#FAFAF9] border border-[#E7E5E1] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1F4D3D] h-full w-[5%]" />
              </div>
              <span className="tabular-nums">5%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-8 tabular-nums">3 star</span>
              <div className="flex-1 bg-[#FAFAF9] border border-[#E7E5E1] h-2 rounded-full overflow-hidden">
                <div className="bg-[#1F4D3D] h-full w-[1%]" />
              </div>
              <span className="tabular-nums">1%</span>
            </div>
          </div>
        </div>

        {/* Praise Badges */}
        <div className="pt-4">
          <div className="flex items-center gap-1.5 text-[12px] font-[600] text-[#14181F] mb-2">
            <ThumbsUp className="w-3.5 h-3.5 text-[#1F4D3D]" />
            <span>Frequent Citizen Praise</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {topPraiseTags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-[#FAFAF9] border border-[#E7E5E1] text-[#14181F] rounded-[8px] text-[12px] font-[500] inline-flex items-center gap-1.5"
              >
                <span>{t.label}</span>
                <span className="text-[10px] text-[#6B7280] font-mono tabular-nums">
                  ({t.count})
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <h3 className="text-[16px] font-[650] text-[#14181F]">
          Recent Verified Reviews
        </h3>

        {reviews.map((rev) => (
          <article
            key={rev.id}
            className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-4 sm:p-5 shadow-xs"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-[14px] font-[650] text-[#14181F]">
                    {rev.citizenName}
                  </h4>
                  <span className="text-[11px] text-[#6B7280]">
                    · {rev.citizenArea}
                  </span>
                </div>
                <div className="text-[11px] text-[#6B7280] mt-0.5">
                  {rev.serviceType} · <span className="tabular-nums">{rev.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= rev.rating 
                        ? 'fill-[#C9A227] text-[#C9A227]' 
                        : 'text-[#E7E5E1]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-[13px] text-[#14181F] leading-relaxed mt-2 bg-[#FAFAF9] p-3 rounded-[8px] border border-[#E7E5E1]">
              "{rev.comment}"
            </p>

            {rev.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {rev.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-[6px] bg-[#FFFFFF] border border-[#E7E5E1] text-[11px] font-[500] text-[#6B7280]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
