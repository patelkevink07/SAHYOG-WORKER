import React, { useState, useRef, useEffect } from 'react';
import { Dispute, DisputeMessage } from '../types';
import { replyToDispute, markDisputeAsRead } from '../lib/disputeService';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  ArrowLeft, 
  Send, 
  ShieldAlert, 
  Clock, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  User,
  AlertCircle
} from 'lucide-react';

interface DisputeThreadScreenProps {
  dispute: Dispute;
  workerName: string;
  onBack: () => void;
}

export const DisputeThreadScreen: React.FC<DisputeThreadScreenProps> = ({
  dispute,
  workerName,
  onBack
}) => {
  const [activeDispute, setActiveDispute] = useState<Dispute>(dispute);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Set up live listener for this specific dispute document
  useEffect(() => {
    const disputeRef = doc(db, 'disputes', dispute.id);
    const unsubscribe = onSnapshot(disputeRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setActiveDispute({
          id: snapshot.id,
          refNumber: data.refNumber || snapshot.id.substring(0, 8).toUpperCase(),
          bookingId: data.bookingId || '',
          bookingRef: data.bookingRef || '',
          workerId: data.workerId || '',
          customerId: data.customerId || data.customerPhone || '',
          customerPhone: data.customerPhone || '',
          complainantName: data.complainantName || 'Citizen Client',
          respondentName: data.respondentName || 'Worker Partner',
          trade: data.trade || '',
          category: data.category || '',
          summary: data.summary || 'Service dispute lodged',
          escrowAmount: typeof data.escrowAmount === 'number' ? data.escrowAmount : 0,
          severity: data.severity || 'Medium',
          lodgedBy: data.lodgedBy || 'customer',
          lodgedDate: data.lodgedDate || new Date().toISOString(),
          status: data.status || 'open',
          messages: Array.isArray(data.messages) ? data.messages : [],
          hasWorkerUnreadUpdate: typeof data.hasWorkerUnreadUpdate === 'boolean' ? data.hasWorkerUnreadUpdate : false,
          hasCustomerUnreadUpdate: typeof data.hasCustomerUnreadUpdate === 'boolean' ? data.hasCustomerUnreadUpdate : false,
          resolutionDecision: data.resolutionDecision,
          resolvedAt: data.resolvedAt,
          resolvedBy: data.resolvedBy,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      }
    }, (err) => {
      console.error('Error listening to dispute doc:', err);
    });

    return () => {
      unsubscribe();
    };
  }, [dispute.id]);

  // Automatically mark dispute as read when opened or when an unread update comes in
  useEffect(() => {
    if (activeDispute.hasWorkerUnreadUpdate) {
      markDisputeAsRead(activeDispute.id).catch((err) => {
        console.error('Failed to mark dispute as read:', err);
      });
    }
  }, [activeDispute.id, activeDispute.hasWorkerUnreadUpdate]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeDispute.messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await replyToDispute(activeDispute, replyText, workerName);
      setReplyText('');
    } catch (err) {
      setErrorMsg('Failed to post reply. Please check connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Dispute['status']) => {
    switch (status) {
      case 'open':
        return (
          <span className="px-2.5 py-0.5 rounded-[6px] bg-[#FEE2E2] text-[#991B1B] text-[11px] font-[700] uppercase tracking-wider border border-[#FECACA] inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C] animate-pulse" />
            <span>Open &amp; Unresolved</span>
          </span>
        );
      case 'under_mediation':
        return (
          <span className="px-2.5 py-0.5 rounded-[6px] bg-[#FEF3C7] text-[#92400E] text-[11px] font-[700] uppercase tracking-wider border border-[#FDE68A] inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
            <span>Under Board Mediation</span>
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2.5 py-0.5 rounded-[6px] bg-[#E8F3EE] text-[#1F4D3D] text-[11px] font-[700] uppercase tracking-wider border border-[#C5DDD2] inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved by Board</span>
          </span>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    const isHigh = (severity || '').toLowerCase() === 'high';
    return (
      <span className={`px-2 py-0.5 rounded-[4px] text-[10.5px] font-[600] uppercase tracking-wider ${
        isHigh 
          ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]' 
          : 'bg-[#FAFAF9] text-[#4B5563] border border-[#E7E5E1]'
      }`}>
        {severity} Severity
      </span>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-12 text-left">
      {/* Top Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="min-h-[44px] inline-flex items-center gap-2 text-[14px] md:text-[15px] font-[600] text-[#1F4D3D] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] rounded-[6px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Terminal</span>
        </button>
        <span className="text-[12.5px] text-[#6B7280] font-mono">
          Case ID: #{activeDispute.refNumber}
        </span>
      </div>

      {/* Dispute Overview Dashboard Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#E7E5E1]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {getStatusBadge(activeDispute.status)}
              {getSeverityBadge(activeDispute.severity)}
            </div>
            <h2 className="text-[18px] sm:text-[20px] font-[700] text-[#14181F] tracking-tight">
              Dispute: {activeDispute.summary}
            </h2>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Booking Ref: <span className="font-mono font-[600] text-[#14181F]">{activeDispute.bookingRef || activeDispute.bookingId}</span> · Lodged: {activeDispute.lodgedDate}
            </p>
          </div>

          <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px] flex flex-col justify-center text-left md:text-right flex-shrink-0 md:min-w-[160px]">
            <span className="text-[11px] text-[#6B7280] uppercase tracking-wider font-semibold block">Escrow Amount</span>
            <span className="text-[18px] sm:text-[20px] font-[700] text-[#B91C1C] tabular-nums mt-0.5 block">
              ₹{activeDispute.escrowAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-[#6B7280]">Safeguarded by Coop Union</span>
          </div>
        </div>

        {/* Dispute Parties Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-4 text-[13px] text-[#4B5563]">
          <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px]">
            <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-wider block">Citizen Complainant</span>
            <span className="font-[650] text-[#14181F] text-[13.5px] mt-0.5 block">{activeDispute.complainantName}</span>
          </div>

          <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E1] rounded-[8px]">
            <span className="text-[11px] text-[#6B7280] font-semibold uppercase tracking-wider block">Respondent Worker</span>
            <span className="font-[650] text-[#14181F] text-[13.5px] mt-0.5 block">{activeDispute.respondentName}</span>
          </div>

          <div className="p-3 bg-[#E8F3EE]/50 border border-[#C5DDD2]/50 rounded-[8px]">
            <span className="text-[11px] text-[#1F4D3D] font-semibold uppercase tracking-wider block">Federation Mediator</span>
            <span className="font-[650] text-[#1F4D3D] text-[13.5px] mt-0.5 block">Cooperative Disputes Board</span>
          </div>
        </div>

        {/* Resolution Statement (if resolved) */}
        {activeDispute.status === 'resolved' && activeDispute.resolutionDecision && (
          <div className="mt-4 p-4 bg-[#E8F3EE] border border-[#C5DDD2] rounded-[8px] flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#1F4D3D] flex-shrink-0 mt-0.5" />
            <div className="text-[13px] text-[#1F4D3D] leading-relaxed">
              <strong className="block font-[700] text-[#1F4D3D]">Official Cooperative Board Resolution:</strong>
              <p className="mt-1 font-[500] italic">"{activeDispute.resolutionDecision}"</p>
              {activeDispute.resolvedBy && (
                <span className="block text-[11px] text-[#6B7280] mt-1.5 font-normal">
                  Approved by {activeDispute.resolvedBy}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Dispute Thread Panel */}
      <div className="bg-[#FFFFFF] border border-[#E7E5E1] rounded-[10px] md:rounded-[12px] shadow-xs overflow-hidden flex flex-col min-h-[420px]">
        {/* Chat Header */}
        <div className="bg-[#FAFAF9] border-b border-[#E7E5E1] px-4 py-3 md:px-5 flex items-center justify-between">
          <span className="text-[13px] font-[650] text-[#14181F] flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#1F4D3D]" />
            <span>Mediation Case Records &amp; Statements</span>
          </span>
          <span className="text-[11.5px] text-[#6B7280] font-semibold">
            All posts are verified and binding
          </span>
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 p-4 md:p-5 space-y-4 overflow-y-auto max-h-[380px] bg-[#FAFAF9]/30">
          {activeDispute.messages.length === 0 ? (
            <div className="py-12 text-center max-w-sm mx-auto">
              <ShieldAlert className="w-8 h-8 text-[#9CA3AF] mx-auto mb-2" />
              <h4 className="text-[14px] font-[650] text-[#14181F]">No Statement Posted Yet</h4>
              <p className="text-[12px] text-[#6B7280] mt-1">
                The cooperative board hasn't registered statements on this case yet. Post your reply below to provide your trade perspective.
              </p>
            </div>
          ) : (
            activeDispute.messages.map((msg) => {
              const isWorker = msg.senderRole === 'worker';
              const isAdmin = msg.senderRole === 'admin';

              if (isAdmin) {
                return (
                  <div key={msg.id} className="p-3.5 bg-[#FEF3C7]/40 border border-[#FDE68A]/60 rounded-[8px] text-[13px] text-[#92400E] max-w-2xl mx-auto text-center shadow-2xs">
                    <div className="font-[750] text-[#92400E] flex items-center justify-center gap-1.5 mb-1 text-[12px] uppercase tracking-wider">
                      <Scale className="w-4 h-4" />
                      <span>{msg.senderName} (Federation Mediator)</span>
                    </div>
                    <p className="italic leading-relaxed">"{msg.message}"</p>
                    {msg.timestamp && (
                      <span className="block text-[10.5px] text-[#6B7280] mt-1 tabular-nums">
                        Posted {typeof msg.timestamp === 'string' ? msg.timestamp : new Date(msg.timestamp?.seconds * 1000).toLocaleString()}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isWorker ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-[10px] p-3.5 border ${
                    isWorker 
                      ? 'bg-[#E8F3EE] text-[#1F4D3D] border-[#C5DDD2]' 
                      : 'bg-[#FFFFFF] text-[#14181F] border-[#E7E5E1]'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-semibold text-[#6B7280]">
                      <User className="w-3 h-3 text-[#6B7280]" />
                      <span>{msg.senderName}</span>
                      <span className="capitalize px-1.5 py-0.2 rounded-sm bg-[#E7E5E1]/50 text-[10px]">
                        {msg.senderRole}
                      </span>
                    </div>
                    <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    {msg.timestamp && (
                      <span className="block text-[10px] text-[#6B7280] mt-1.5 text-right tabular-nums">
                        {typeof msg.timestamp === 'string' ? msg.timestamp : new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Submission Box */}
        {activeDispute.status !== 'resolved' ? (
          <form 
            onSubmit={handleSendReply} 
            className="border-t border-[#E7E5E1] p-3 bg-[#FFFFFF]"
          >
            {errorMsg && (
              <div className="mb-2.5 p-2 bg-[#FEE2E2] text-[#991B1B] text-[12px] font-medium rounded-[6px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label htmlFor="dispute-statement-textarea" className="sr-only">
                  Write verified response statement
                </label>
                <textarea
                  id="dispute-statement-textarea"
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Explain your perspective, details of service executed, or materials used. This is submitted as formal cooperative mediation record."
                  className="w-full text-[13.5px] p-2.5 border border-[#CBD5E1] rounded-[8px] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D3D] focus:border-[#1F4D3D] resize-none bg-[#FAFAF9]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                id="submit-dispute-reply-btn"
                disabled={!replyText.trim() || isSubmitting}
                className="min-h-[44px] min-w-[44px] sm:min-w-[100px] px-3.5 py-2.5 bg-[#1F4D3D] hover:bg-[#173C2F] disabled:bg-[#FAFAF9] disabled:border-[#E7E5E1] disabled:text-[#9CA3AF] text-[#FFFFFF] rounded-[8px] font-[600] text-[13px] flex items-center justify-center gap-1.5 border border-transparent shadow-xs transition-colors"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-[#1F4D3D] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Post Reply</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 bg-[#FAFAF9] border-t border-[#E7E5E1] text-center text-[12.5px] text-[#6B7280] font-medium">
            🔒 Case Closed. This dispute has been resolved by the federation board. No further statements can be posted.
          </div>
        )}
      </div>

      {/* Disputes Info Advisory Banner */}
      <div className="bg-[#FAFAF9] border border-[#E7E5E1] rounded-[10px] p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#B45309] flex-shrink-0 mt-0.5" />
        <div className="text-[12.5px] text-[#6B7280] leading-relaxed">
          <strong className="text-[#14181F] font-[600]">Sahyog Cooperative Dispute Advisory:</strong>
          <p className="mt-0.5">
            Active disputes are handled in parallel with standard service dispatches and will <strong className="text-[#14181F] font-[600]">not block</strong> your eligibility for other incoming booking requests. Please respond promptly with accurate facts to help mediators settle the escrow balance fairly.
          </p>
        </div>
      </div>
    </div>
  );
};
