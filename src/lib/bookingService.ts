import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDocFromServer,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from './firebase';
import { JobCategory, JobRequest, JobUrgency, WorkerProfile } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test initial connection as required by standard Firestore integration guidelines
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore: client is offline or network is disconnected.');
    }
  }
}

// Map Firestore booking document data into the worker app's JobRequest shape
export function mapBookingDocToJobRequest(id: string, data: Record<string, any>): JobRequest {
  const rawCategory = (data.category || data.serviceCategory || data.service || 'general-repair').toLowerCase();
  const validCategories: JobCategory[] = [
    'plumbing', 'electrical', 'carpentry', 'painting', 'domestic-help',
    'elder-care', 'moving', 'appliance-repair', 'gardening', 'general-repair'
  ];
  const category: JobCategory = validCategories.includes(rawCategory as JobCategory) 
    ? (rawCategory as JobCategory) 
    : 'general-repair';

  // Determine urgency
  let urgency: JobUrgency = 'Standard';
  const rawUrgency = String(data.urgency || data.priority || '').toLowerCase();
  if (rawUrgency.includes('emerg') || rawUrgency === 'high' || rawUrgency === 'urgent') {
    urgency = 'Emergency';
  } else if (rawUrgency.includes('sched') || rawUrgency === 'slot' || rawUrgency === 'later') {
    urgency = 'Scheduled';
  }

  // Format pricing
  let price = 400;
  if (typeof data.price === 'number' && !isNaN(data.price)) {
    price = data.price;
  } else if (typeof data.amount === 'number' && !isNaN(data.amount)) {
    price = data.amount;
  } else if (typeof data.totalAmount === 'number' && !isNaN(data.totalAmount)) {
    price = data.totalAmount;
  } else if (typeof data.fare === 'number' && !isNaN(data.fare)) {
    price = data.fare;
  } else if (data.price) {
    price = Number(data.price) || 400;
  } else if (data.amount) {
    price = Number(data.amount) || 400;
  }

  // Distance formatting
  let distanceKm = 2.4;
  if (typeof data.distanceKm === 'number' && !isNaN(data.distanceKm)) {
    distanceKm = data.distanceKm;
  } else if (typeof data.distance === 'number' && !isNaN(data.distance)) {
    distanceKm = data.distance;
  } else if (data.distanceKm) {
    distanceKm = parseFloat(data.distanceKm) || 2.4;
  }

  // Time window string
  let timeWindow = data.timeWindow || data.scheduledSlot || data.timeSlot || data.time || '';
  if (!timeWindow) {
    timeWindow = urgency === 'Emergency' ? 'Within 25 mins' : urgency === 'Scheduled' ? 'Scheduled Slot today' : 'Within 1 hour';
  }

  // Formatted relative timestamp
  let timestamp = 'Just now';
  try {
    const rawTime = data.createdAt || data.timestamp || data.requestedAt;
    if (rawTime) {
      let date: Date | null = null;
      if (typeof rawTime.toDate === 'function') {
        date = rawTime.toDate();
      } else if (rawTime instanceof Date) {
        date = rawTime;
      } else if (typeof rawTime === 'string' || typeof rawTime === 'number') {
        date = new Date(rawTime);
      }
      if (date && !isNaN(date.getTime())) {
        const diffMs = Date.now() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) {
          timestamp = 'Just now';
        } else if (diffMins < 60) {
          timestamp = `${diffMins}m ago`;
        } else {
          const diffHours = Math.floor(diffMins / 60);
          timestamp = `${diffHours}h ago`;
        }
      }
    }
  } catch {
    timestamp = 'Recent';
  }

  return {
    id,
    title: data.title || data.serviceTitle || data.serviceName || `${category} Service`,
    category,
    urgency,
    urgencyLabel: data.urgencyLabel || (urgency === 'Emergency' ? 'Emergency Dispatch' : urgency === 'Scheduled' ? 'Scheduled Slot' : 'Standard Booking'),
    customerName: data.customerName || data.citizenName || data.userName || data.name || 'Citizen User',
    customerPhone: data.customerPhone || data.citizenPhone || data.userPhone || data.phone || '+91 98101 23456',
    address: data.address || data.citizenAddress || data.userAddress || data.location || 'New Delhi Area',
    area: data.area || data.locality || data.sector || 'Delhi NCR',
    distanceKm,
    timeWindow,
    price,
    priceType: data.priceType || 'Fixed Federation Tariff',
    description: data.description || data.details || data.problem || data.issue || 'Service requested through Sahyog Citizen application.',
    notes: data.notes || data.instructions || data.specialInstructions || '',
    materialsProvided: Boolean(data.materialsProvided ?? true),
    status: (data.status as any) || 'requested',
    timestamp
  };
}

/**
 * 1. The incoming job queue live-subscribes (onSnapshot) to the "bookings" collection,
 * filtered to dispatches targeted to this worker (by worker ID or primary service category)
 * with status "requested" or "pending".
 */
export function subscribeToIncomingBookings(
  workerOrId: string | WorkerProfile,
  onUpdate: (jobs: JobRequest[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const workerId = typeof workerOrId === 'string' ? workerOrId : workerOrId.id;
  const primaryServiceId = typeof workerOrId === 'object' && workerOrId.primaryServiceId 
    ? workerOrId.primaryServiceId.toLowerCase()
    : '';

  const bookingsRef = collection(db, 'bookings');

  return onSnapshot(
    bookingsRef,
    (snapshot) => {
      const jobs: JobRequest[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const status = String(data.status || '').toLowerCase().trim();
        
        // Only consider pending/requested bookings
        if (status !== 'requested' && status !== 'pending') {
          return;
        }

        const rawCategory = String(data.category || data.serviceCategory || data.service || '').toLowerCase().trim();
        const docWorkerId = String(data.workerId || '').trim();

        // Check if directly addressed to this worker (by ID or trade worker ID)
        const isDirectWorkerMatch = Boolean(
          docWorkerId && (
            docWorkerId === workerId ||
            (primaryServiceId && (
              docWorkerId === `worker-${primaryServiceId}` ||
              docWorkerId === primaryServiceId
            ))
          )
        );

        // If explicitly assigned to a different worker, don't show here
        const isAssignedToOtherWorker = Boolean(
          docWorkerId && !isDirectWorkerMatch
        );

        if (isAssignedToOtherWorker) {
          return;
        }

        // Category match check
        const isCategoryMatch = Boolean(
          primaryServiceId && (
            rawCategory === primaryServiceId ||
            rawCategory.replace(/\s+/g, '-') === primaryServiceId ||
            rawCategory.includes(primaryServiceId)
          )
        );

        // Accept if directly assigned to this worker, OR if unassigned broadcast and matches this worker's trade category
        if (isDirectWorkerMatch || (!docWorkerId && isCategoryMatch)) {
          jobs.push(mapBookingDocToJobRequest(docSnap.id, data));
        }
      });

      onUpdate(jobs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
      if (onError) onError(error);
    }
  );
}

/**
 * Persists status updates to Firestore for bookings.
 * Supported values: requested, accepted, in_progress, completed, cancelled, rejected.
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled',
  extraFields?: Record<string, any>
): Promise<void> {
  const bookingRef = doc(db, 'bookings', bookingId);
  try {
    const payload: Record<string, any> = {
      status,
      ...(extraFields || {})
    };
    await updateDoc(bookingRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${bookingId}`);
    throw error;
  }
}
