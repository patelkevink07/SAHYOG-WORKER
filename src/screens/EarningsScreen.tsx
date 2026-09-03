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
  ArrowUpRight
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
  const welfareReserve = period === 'week' ? 200 : 800;
  const netEarnings = grossEarnings - welfareReserve;

  // Daily distribution data for simple clean bar chart
  const weekDays = [
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
    <div className="space-y-4 pb-12 text-left">
      {/* Period Selector Tabs */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-[650] text-[#14181F] tracking-tight">
          Cooperative Settlement Ledger
        </h2>

        <div className="flex p-1 bg-[#FFFFFF] border border-[#E7E5E1] rounded-[8px]">
          <button
            type="button"
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 text-[12px] font-[600] rounded-[6px] transition-colors ${
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
            className={`px-3 py-1 text-[12px] font-[600] rounded-[6px] transition-colors ${
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
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[12px] font-[500] text-[#6B7280]">
              {period === 'week' ? 'Current Week Settlement' : 'Monthly Settlement Ledger'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <h3 className="text-[32px] sm:text-[38px] font-[650] text-[#14181F] tabular-nums leading-none tracking-tight">
                ₹{grossEarnings.toLocaleString('en-IN')}
              </h3>
            </div>
            <p className="text-[13px] text-[#1F4D3D] font-[600] mt-2 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#1F4D3D]" />
              <span>100% Base Wage Retained · Scheduled to Bank Friday 18:00</span>
            </p>
          </div>

          <div className="self-start px-3 py-1.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[8px] text-[#166534] text-[12px] font-[600] tabular-nums">
            {period === 'week' ? `${completedJobsCount} Jobs Completed` : `${completedJobsCount * 4} Jobs Completed`}
          </div>
        </div>

        {/* Fact Table: Gross, Commission (0%), Welfare, Net */}
        <div className="mt-6 pt-5 border-t border-[#E7E5E1] grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div>
            <span className="text-[12px] text-[#6B7280]">Gross Labor Fee</span>
            <div className="text-[17px] font-[650] text-[#14181F] tabular-nums mt-0.5">
              ₹{grossEarnings.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <span className="text-[12px] text-[#6B7280]">Platform Cut (Civic)</span>
            <div className="text-[17px] font-[650] text-[#15803D] tabular-nums mt-0.5">
              ₹0 (0%)
            </div>
          </div>

          <div>
            <span className="text-[12px] text-[#6B7280]">Welfare Reserve</span>
            <div className="text-[17px] font-[650] text-[#6B7280] tabular-nums mt-0.5">
              -₹{welfareReserve.toLocaleString('en-IN')}
            </div>
          </div>

          <div>
            <span className="text-[12px] text-[#6B7280]">Net Payout Ready</span>
            <div className="text-[17px] font-[650] text-[#1F4D3D] tabular-nums mt-0.5 font-bold">
              ₹{netEarnings.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Simple Factual Daily Distribution (Bar chart / list) */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[14px] font-[650] text-[#14181F]">
            Daily Earning Distribution
          </h4>
          <span className="text-[12px] text-[#6B7280]">
            Delhi Shramik Union Shift Logs
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2 pb-1 items-end h-32">
          {weekDays.map((wd) => {
            const heightPct = Math.max(Math.round((wd.amount / maxDailyAmount) * 100), 8);
            const barHeightClass = 
              heightPct >= 85 ? 'h-24' :
              heightPct >= 70 ? 'h-20' :
              heightPct >= 55 ? 'h-16' :
              heightPct >= 40 ? 'h-12' :
              heightPct >= 25 ? 'h-8' : 'h-5';

            return (
              <div key={wd.day} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity mb-1 tabular-nums">
                  ₹{wd.amount}
                </span>
                <div 
                  className={`w-full max-w-[28px] bg-[#1F4D3D] hover:bg-[#173C2F] rounded-t-[4px] transition-all ${barHeightClass}`}
                  title={`${wd.day}: ₹${wd.amount} (${wd.jobs} jobs)`}
                />
                <span className="text-[11px] font-[500] text-[#14181F] mt-2">
                  {wd.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cooperative Welfare Reserve Breakdown (Framed as Membership Benefits, Not Gig Incentives) */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E1]">
          <div>
            <h4 className="text-[16px] font-[650] text-[#14181F]">
              Cooperative Welfare & Escrow Ledger
            </h4>
            <p className="text-[12px] text-[#6B7280]">
              NCCT & Delhi Shramik Member Welfare Fund allocations
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-[#1F4D3D]" />
        </div>

        <div className="divide-y divide-[#E7E5E1]">
          {welfareBenefits.map((benefit) => (
            <div key={benefit.id} className="py-3.5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-[8px] bg-[#FAFAF9] border border-[#E7E5E1] text-[#1F4D3D] mt-0.5">
                  {benefit.category === 'health' && <HeartHandshake className="w-4 h-4" />}
                  {benefit.category === 'tools' && <Wrench className="w-4 h-4" />}
                  {benefit.category === 'insurance' && <ShieldCheck className="w-4 h-4" />}
                  {benefit.category === 'pension' && <Layers className="w-4 h-4" />}
                </div>

                <div>
                  <div className="text-[14px] font-[600] text-[#14181F]">
                    {benefit.title}
                  </div>
                  <p className="text-[12px] text-[#6B7280] mt-0.5 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="text-[13px] font-[600] text-[#14181F] tabular-nums">
                  {typeof benefit.deductionAmount === 'number' 
                    ? `₹${benefit.deductionAmount}` 
                    : benefit.deductionAmount}
                </span>
                <span className="block text-[11px] text-[#15803D] font-[500]">
                  {benefit.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Settlement Transcripts */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] p-5 shadow-xs">
        <h4 className="text-[15px] font-[650] text-[#14181F] mb-3">
          Settlement History
        </h4>

        <div className="space-y-2.5">
          {settlements.map((st) => (
            <div 
              key={st.id} 
              className="flex items-center justify-between p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] text-[13px]"
            >
              <div>
                <div className="font-[600] text-[#14181F]">
                  Direct Bank NEFT · {st.bankAccount}
                </div>
                <div className="text-[11px] text-[#6B7280]">
                  Ref: {st.reference} · {st.date}
                </div>
              </div>

              <div className="text-right">
                <span className="font-[650] text-[#14181F] tabular-nums">
                  ₹{st.amount.toLocaleString('en-IN')}
                </span>
                <span className="block text-[11px] text-[#15803D] font-[600]">
                  {st.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
