import React, { useState, useEffect } from 'react';
import { CustomerReview, WorkerProfile } from '../types';
import { Star, ArrowLeft, ShieldCheck, ThumbsUp } from 'lucide-react';
import { getWorkerReviews } from '../lib/workerService';

interface ReviewsScreenProps {
  worker: WorkerProfile;
  reviews: CustomerReview[];
  onBack: () => void;
}

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({
  worker,
  reviews: fallbackReviews,
  onBack
}) => {
  const isNewWorker = worker.reviewCount === 0;
  const [reviewsList, setReviewsList] = useState<CustomerReview[]>(() => {
    return isNewWorker ? [] : fallbackReviews;
  });

  useEffect(() => {
    let isMounted = true;
    if (isNewWorker) {
      setReviewsList([]);
      return;
    }
    getWorkerReviews(worker.id).then((customReviews) => {
      if (isMounted && customReviews && customReviews.length > 0) {
        setReviewsList(customReviews);
      } else if (isMounted) {
        setReviewsList(fallbackReviews);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [worker.id, fallbackReviews, isNewWorker]);

  const topPraiseTags = [
    { label: 'Prompt Arrival', count: 184 },
    { label: 'Fair Federation Tariff', count: 172 },
    { label: 'Clean Work Site', count: 156 },
    { label: 'Transparent Advice', count: 140 },
    { label: 'Respectful Demeanor', count: 128 }
  ];

  return (
    <div className="space-y-4 md:space-y-6 pb-12 text-left">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-[14px] md:text-[15px] font-[600] text-[#1F4D3D] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] rounded-[6px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-[12px] md:text-[13px] text-[#6B7280]">
          Read-Only Citizen Feedback
        </span>
      </div>

      {/* Aggregate Rating Overview Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-5 sm:p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E7E5E1]">
          <div>
            <span className="text-[12px] md:text-[13px] font-[500] text-[#6B7280]">
              Overall Performance Rating
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[36px] md:text-[42px] font-[650] text-[#14181F] tabular-nums leading-none">
                {worker.reviewCount > 0 ? worker.rating.toFixed(2) : '5.0'}
              </span>
              <span className="text-[16px] md:text-[18px] text-[#6B7280] font-[500]">
                / 5.0
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 md:w-5 md:h-5 fill-[#C9A227] text-[#C9A227]" />
              ))}
              <span className="text-[13px] md:text-[14px] text-[#6B7280] ml-2 tabular-nums font-[500]">
                {worker.reviewCount > 0 
                  ? `Based on ${worker.reviewCount} verified citizen bookings` 
                  : 'New verified cooperative partner (0 citizen reviews)'}
              </span>
            </div>
          </div>

          <div className="space-y-2 w-full sm:w-56 md:w-64 text-[12px] text-[#6B7280]">
            <div className="flex items-center gap-2">
              <span className="w-10 tabular-nums font-[500]">5 star</span>
              <div className="flex-1 bg-[#FAFAF9] border border-[#E7E5E1] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1F4D3D] h-full w-[100%]" />
              </div>
              <span className="w-8 text-right tabular-nums font-[500]">{worker.reviewCount > 0 ? '94%' : '100%'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 tabular-nums font-[500]">4 star</span>
              <div className="flex-1 bg-[#FAFAF9] border border-[#E7E5E1] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1F4D3D] h-full w-[0%]" />
              </div>
              <span className="w-8 text-right tabular-nums font-[500]">{worker.reviewCount > 0 ? '5%' : '0%'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 tabular-nums font-[500]">3 star</span>
              <div className="flex-1 bg-[#FAFAF9] border border-[#E7E5E1] h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#1F4D3D] h-full w-[0%]" />
              </div>
              <span className="w-8 text-right tabular-nums font-[500]">{worker.reviewCount > 0 ? '1%' : '0%'}</span>
            </div>
          </div>
        </div>

        {/* Praise Badges */}
        {worker.reviewCount > 0 ? (
          <div className="pt-4 md:pt-5">
            <div className="flex items-center gap-1.5 text-[12px] md:text-[13px] font-[600] text-[#14181F] mb-2.5">
              <ThumbsUp className="w-3.5 h-3.5 text-[#1F4D3D]" />
              <span>Frequent Citizen Praise</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topPraiseTags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 md:px-3 md:py-1.5 bg-[#FAFAF9] border border-[#E7E5E1] text-[#14181F] rounded-[8px] text-[12px] md:text-[13px] font-[500] inline-flex items-center gap-1.5"
                >
                  <span>{t.label}</span>
                  <span className="text-[10px] md:text-[11px] text-[#6B7280] font-mono tabular-nums">
                    ({t.count})
                  </span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="pt-4 flex items-center gap-2 text-[12.5px] text-[#1F4D3D] font-[500]">
            <ShieldCheck className="w-4 h-4 text-[#1F4D3D]" />
            <span>Cooperative quality assurance active on all service dispatches.</span>
          </div>
        )}
      </div>

      {/* Reviews List: Responsive 2-column grid on md/lg */}
      <div className="space-y-3 md:space-y-4">
        <h3 className="text-[16px] md:text-[18px] font-[650] text-[#14181F]">
          Recent Verified Reviews
        </h3>

        {reviewsList.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-8 text-center shadow-xs">
            <ShieldCheck className="w-8 h-8 text-[#1F4D3D] mx-auto mb-2" />
            <h4 className="text-[15px] font-[650] text-[#14181F]">No Citizen Reviews Yet</h4>
            <p className="text-[13px] text-[#6B7280] mt-1 max-w-md mx-auto">
              Verified customer ratings, stars, and feedback will be recorded and shown here as you complete bookings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 md:gap-4">
            {reviewsList.map((rev) => (
              <article
                key={rev.id}
                className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-4 sm:p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] md:text-[15px] font-[650] text-[#14181F]">
                          {rev.citizenName}
                        </h4>
                        <span className="text-[11px] md:text-[12px] text-[#6B7280]">
                          · {rev.citizenArea}
                        </span>
                      </div>
                      <div className="text-[11px] md:text-[12px] text-[#6B7280] mt-0.5">
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

                  <p className="text-[13px] md:text-[14px] text-[#14181F] leading-relaxed mt-2 bg-[#FAFAF9] p-3 md:p-3.5 rounded-[8px] border border-[#E7E5E1]">
                    "{rev.comment}"
                  </p>
                </div>

                {rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2">
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
        )}
      </div>
    </div>
  );
};
