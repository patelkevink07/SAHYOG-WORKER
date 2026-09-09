import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { Dispute, DisputeMessage } from '../types';
import { handleFirestoreError, OperationType } from './bookingService';

/**
 * Subscribes live to disputes filtered by the current worker's ID.
 */
export function subscribeToDisputes(
  workerId: string,
  onUpdate: (disputes: Dispute[]) => void,
  onError?: (err: any) => void
): Unsubscribe {
  const disputesRef = collection(db, 'disputes');
  const q = query(disputesRef, where('workerId', '==', workerId));

  return onSnapshot(
    q,
    (snapshot) => {
      const disputes: Dispute[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        disputes.push({
          id: docSnap.id,
          refNumber: data.refNumber || docSnap.id.substring(0, 8).toUpperCase(),
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
      });
      onUpdate(disputes);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'disputes');
      if (onError) onError(error);
    }
  );
}

/**
 * Appends a message to the dispute, updating the status and read flags.
 */
export async function replyToDispute(
  dispute: Dispute,
  messageText: string,
  workerName: string
): Promise<void> {
  if (!messageText.trim()) return;

  const disputeRef = doc(db, 'disputes', dispute.id);
  
  const newMessage: DisputeMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    senderRole: 'worker',
    senderName: workerName,
    message: messageText.trim(),
    timestamp: new Date().toISOString()
  };

  const hasWorkerRepliedBefore = dispute.messages.some(m => m.senderRole === 'worker');
  const newStatus = (!hasWorkerRepliedBefore && dispute.status === 'open') 
    ? 'under_mediation' 
    : dispute.status;

  const updateData: any = {
    messages: arrayUnion(newMessage),
    hasCustomerUnreadUpdate: true,
    hasWorkerUnreadUpdate: false,
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  try {
    await updateDoc(disputeRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `disputes/${dispute.id}`);
    throw error;
  }
}

/**
 * Clears the worker unread update flag.
 */
export async function markDisputeAsRead(disputeId: string): Promise<void> {
  const disputeRef = doc(db, 'disputes', disputeId);
  try {
    await updateDoc(disputeRef, {
      hasWorkerUnreadUpdate: false
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `disputes/${disputeId}`);
    throw error;
  }
}
