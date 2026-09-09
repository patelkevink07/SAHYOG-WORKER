import React, { useState } from 'react';
import { WelfareBenefit, SettlementRecord } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  Wrench, 
  CheckCircle2, 
  Calendar,
  Layers,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface EarningsScreenProps {
  currentWeekTotal: number;
  completedJobsCount: number;
  welfareBenefits: WelfareBenefit[];
  settlements: SettlementRecord[];
}

export const EarningsScreen: React.FC<EarningsScreenProps> = ({
  currentWeekTotal,
  completedJobsCount,
  welfareBenefits,
  settlements
}) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const grossEarnings = period === 'week' ? currentWeekTotal : currentWeekTotal * 4.2;
  const platformFee = 0; // 0% cooperative cut
  const welfareReserve = grossEarnings > 0 ? (period === 'week' ? Math.min(200, grossEarnings) : Math.min(800, grossEarnings)) : 0;
  const netEarnings = Math.max(0, grossEarnings - welfareReserve);

  // Daily distribution data for simple clean bar chart
  const weekDays = completedJobsCount === 0 && currentWeekTotal === 0
    ? [
        { day: 'Mon', amount: 0, jobs: 0 },
        { day: 'Tue', amount: 0, jobs: 0 },
        { day: 'Wed', amount: 0, jobs: 0 },
        { day: 'Thu', amount: 0, jobs: 0 },
        { day: 'Fri', amount: 0, jobs: 0 },
        { day: 'Sat', amount: 0, jobs: 0 },
        { day: 'Sun', amount: 0, jobs: 0 }
      ]
    : [
        { day: 'Mon', amount: 1450, jobs: 3 },
        { day: 'Tue', amount: 1200, jobs: 2 },
        { day: 'Wed', amount: 1850, jobs: 4 },
        { day: 'Thu', amount: 1600, jobs: 3 },
        { day: 'Fri', amount: 1300, jobs: 3 },
        { day: 'Sat', amount: 1050, jobs: 2 },
        { day: 'Sun', amount: currentWeekTotal - 8450 > 0 ? (currentWeekTotal - 8450) : 0, jobs: 1 }
      ];

  const maxDailyAmount = Math.max(...weekDays.map(d => d.amount), 2000);

  return (
    <div className="space-y-4 md:space-y-6 pb-12 text-left">
      {/* Period Selector Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] sm:text-[20px] md:text-[22px] font-[650] text-[#14181F] tracking-tight">
            Cooperative Settlement Ledger
          </h2>
          <p className="text-[12px] md:text-[13px] text-[#6B7280]">
            Direct bank settlements · 0% commission deduction
          </p>
        </div>

        <div className="flex p-1 bg-[#FFFFFF] border border-[#E7E5E1] rounded-[8px] shadow-xs">
          <button
            type="button"
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 text-[12px] md:text-[13px] font-[600] rounded-[6px] transition-colors ${
              period === 'week'
                ? 'bg-[#1F4D3D] text-[#FFFFFF]'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 text-[12px] md:text-[13px] font-[600] rounded-[6px] transition-colors ${
              period === 'month'
                ? 'bg-[#1F4D3D] text-[#FFFFFF]'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Top Ledger Summary Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-5 sm:p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[12px] md:text-[13px] font-[500] text-[#6B7280]">
              {period === 'week' ? 'Current Week Settlement' : 'Monthly Settlement Ledger'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <h3 className="text-[32px] sm:text-[38px] md:text-[44px] font-[650] text-[#14181F] tabular-nums leading-none tracking-tight">
                ₹{grossEarnings.toLocaleString('en-IN')}
              </h3>
            </div>
            <p className="text-[13px] md:text-[14px] text-[#1F4D3D] font-[600] mt-2.5 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#1F4D3D]" />
              <span>100% Base Wage Retained · Scheduled to Bank Friday 18:00</span>
            </p>
          </div>

          <div className="self-start px-3 py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] text-[#166534] text-[12px] md:text-[13px] font-[600] tabular-nums shadow-xs">
            {period === 'week' ? `${completedJobsCount} Jobs Completed` : `${completedJobsCount * 4} Jobs Completed`}
          </div>
        </div>

        {/* Fact Table: Gross, Commission (0%), Welfare, Net */}
        <div className="mt-6 pt-5 border-t border-[#E7E5E1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]/60">
            <span className="text-[12px] md:text-[13px] text-[#6B7280]">Gross Labor Fee</span>
            <div className="text-[17px] md:text-[20px] font-[650] text-[#14181F] tabular-nums mt-0.5">
              ₹{grossEarnings.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]/60">
            <span className="text-[12px] md:text-[13px] text-[#6B7280]">Platform Cut (Civic)</span>
            <div className="text-[17px] md:text-[20px] font-[650] text-[#15803D] tabular-nums mt-0.5">
              ₹0 (0%)
            </div>
          </div>

          <div className="p-3 bg-[#FAFAF9] rounded-[8px] border border-[#E7E5E1]/60">
            <span className="text-[12px] md:text-[13px] text-[#6B7280]">Welfare Reserve</span>
            <div className="text-[17px] md:text-[20px] font-[650] text-[#6B7280] tabular-nums mt-0.5">
              -₹{welfareReserve.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-[#E8F3EE] rounded-[8px] border border-[#C5DDD2]">
            <span className="text-[12px] md:text-[13px] text-[#1F4D3D] font-[600]">Net Payout Ready</span>
            <div className="text-[17px] md:text-[20px] font-[650] text-[#1F4D3D] tabular-nums mt-0.5 font-bold">
              ₹{netEarnings.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive 2-Column Grid on Desktop (lg:grid-cols-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        {/* Left Column (Daily Distribution + Settlement History) */}
        <div className="lg:col-span-6 space-y-5 md:space-y-6">
          {/* Simple Factual Daily Distribution */}
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[14px] md:text-[16px] font-[650] text-[#14181F]">
                Daily Earning Distribution
              </h4>
              <span className="text-[12px] text-[#6B7280]">
                Delhi Shramik Union Shift Logs
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2 pb-1 items-end h-36 md:h-44">
              {weekDays.map((wd) => {
                const heightPct = Math.max(Math.round((wd.amount / maxDailyAmount) * 100), 8);

                return (
                  <div key={wd.day} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] md:text-[11px] font-mono text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums">
                      ₹{wd.amount}
                    </span>
                    <div 
                      className="w-full max-w-[32px] bg-[#1F4D3D] hover:bg-[#173C2F] rounded-t-[4px] transition-all"
                      style={{ height: `${heightPct}%` }}
                      title={`${wd.day}: ₹${wd.amount} (${wd.jobs} jobs)`}
                    />
                    <span className="text-[11px] md:text-[12px] font-[500] text-[#14181F] mt-2">
                      {wd.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Settlement Transcripts */}
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-5 sm:p-6 shadow-xs">
            <h4 className="text-[15px] md:text-[16px] font-[650] text-[#14181F] mb-3">
              Settlement History
            </h4>

            {completedJobsCount === 0 || settlements.length === 0 ? (
              <div className="py-7 text-center text-[#6B7280]">
                <Clock className="w-6 h-6 text-[#9CA3AF] mx-auto mb-2" />
                <p className="text-[13px] font-[600] text-[#14181F]">No Past Settlements</p>
                <p className="text-[12px] text-[#6B7280] mt-0.5 max-w-xs mx-auto">
                  Weekly earnings are credited via direct NEFT every Friday once you complete citizen bookings.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {settlements.map((st) => (
                  <div 
                    key={st.id} 
                    className="flex items-center justify-between p-3.5 bg-[#FAFAF9] hover:bg-[#F4F4F2] border border-[#E7E5E1] rounded-[8px] text-[13px] md:text-[13.5px] transition-colors"
                  >
                    <div>
                      <div className="font-[600] text-[#14181F]">
                        Direct Bank NEFT · {st.bankAccount}
                      </div>
                      <div className="text-[11px] md:text-[12px] text-[#6B7280] mt-0.5">
                        Ref: {st.reference} · {st.date}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-[650] text-[#14181F] tabular-nums text-[14px] md:text-[15px]">
                        ₹{st.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[11px] text-[#15803D] font-[600]">
                        {st.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Cooperative Welfare Reserve Breakdown) */}
        <div className="lg:col-span-6 space-y-5 md:space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-5 sm:p-6 shadow-xs h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
                <div>
                  <h4 className="text-[16px] md:text-[17px] font-[650] text-[#14181F]">
                    Cooperative Welfare & Escrow Ledger
                  </h4>
                  <p className="text-[12px] md:text-[13px] text-[#6B7280]">
                    NCCT & Delhi Shramik Member Welfare Fund allocations
                  </p>
                </div>
                <ShieldCheck className="w-5 h-5 text-[#1F4D3D]" />
              </div>

              <div className="divide-y divide-[#E7E5E1]">
                {welfareBenefits.map((benefit) => (
                  <div key={benefit.id} className="py-3.5 md:py-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-[#1F4D3D] mt-0.5 flex-shrink-0">
                        {benefit.category === 'health' && <HeartHandshake className="w-4 h-4 md:w-5 md:h-5" />}
                        {benefit.category === 'tools' && <Wrench className="w-4 h-4 md:w-5 md:h-5" />}
                        {benefit.category === 'insurance' && <ShieldCheck className="w-4 h-4 md:w-5 md:h-5" />}
                        {benefit.category === 'pension' && <Layers className="w-4 h-4 md:w-5 md:h-5" />}
                      </div>

                      <div>
                        <div className="text-[14px] md:text-[15px] font-[600] text-[#14181F]">
                          {benefit.title}
                        </div>
                        <p className="text-[12px] md:text-[13px] text-[#6B7280] mt-0.5 leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[13px] md:text-[14px] font-[600] text-[#14181F] tabular-nums">
                        {typeof benefit.deductionAmount === 'number' 
                          ? `₹${benefit.deductionAmount}` 
                          : benefit.deductionAmount}
                      </span>
                      <span className="block text-[11px] md:text-[12px] text-[#15803D] font-[500]">
                        {benefit.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#E7E5E1] text-[12px] md:text-[13px] text-[#6B7280] flex items-center justify-between">
              <span>Audited under National Cooperative Act</span>
              <span className="text-[#1F4D3D] font-[600]">Govt. Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
