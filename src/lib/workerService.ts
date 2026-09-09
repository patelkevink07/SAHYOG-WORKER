import { collection, onSnapshot, getDocs, doc, getDoc, setDoc, addDoc, Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import { WorkerProfile, CustomerReview, JobCategory, JOB_CATEGORY_LABELS } from '../types';
import { handleFirestoreError, OperationType } from './bookingService';
import { WORKER_PHOTO_BY_SERVICE } from './workerPhotos';

// Fallback seed data for the 10 federation trade workers
export const DEFAULT_WORKERS: WorkerProfile[] = [
  {
    id: 'worker-1',
    memberId: 'DSF-PLM-2018-0442',
    name: 'Ramesh Chand Verma',
    avatarInitials: 'RC',
    phone: '+91 98765 43210',
    trade: 'Plumbing',
    certificationLevel: 'Level 4 Master Plumber',
    federationName: 'Delhi Shramik Federation',
    memberSinceYear: 2018,
    operationalRadiusKm: 6.0,
    rating: 4.95,
    reviewCount: 214,
    completedJobsCount: 380,
    acceptanceRate: 98,
    dailyJobCap: 4,
    dailyJobsCompleted: 2,
    todayPayout: 1050,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Delhi Police Central Registry (Mayur Vihar PS). Valid through Dec 2026.',
    skillCertificationDetails: 'National Council for Cooperative Training (NCCT) Grade 1 Plumbing Accreditation.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Delhi State Cooperative Federation voting shareholder with full mutual welfare ledger access.',
    skills: ['Pipe Diagnostics', 'Sanitary Fixtures', 'Geyser Line Repair', 'Overhead Tank Valves', 'Drain Clearance'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['plumbing'],
    summary: 'Master plumber with 14 years experience in residential line pressure and concealed leak diagnostics.',
    hourlyRate: 350,
    primaryServiceId: 'plumbing'
  },
  {
    id: 'worker-2',
    memberId: 'MKM-ELE-2019-1108',
    name: 'Sunita Rajesh Shinde',
    avatarInitials: 'SS',
    phone: '+91 98230 45678',
    trade: 'Electrical',
    certificationLevel: 'State Licensed Wireman L4',
    federationName: 'Maharashtra Karigar Mahasangh',
    memberSinceYear: 2019,
    operationalRadiusKm: 5.5,
    rating: 4.95,
    reviewCount: 188,
    completedJobsCount: 412,
    acceptanceRate: 99,
    dailyJobCap: 4,
    dailyJobsCompleted: 1,
    todayPayout: 800,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Maharashtra Police (Pune Division). Valid through 2027.',
    skillCertificationDetails: 'State Electrical Supervisory License (PWD) & NCCT Cooperative Skills Endorsement.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Karigar Mahasangh technical board voting delegate.',
    skills: ['Distribution Boards', 'Inverter Setup', 'Load Balancing', 'Tripping Diagnostics', 'Short Circuit Isolation'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['electrical'],
    summary: 'Licensed electrical technician specializing in home earthing inspection, overload prevention, and safe modular distribution boards.',
    hourlyRate: 380,
    primaryServiceId: 'electrical'
  },
  {
    id: 'worker-3',
    memberId: 'NWG-CRP-2017-0623',
    name: 'Harpreet Singh Dhillon',
    avatarInitials: 'HD',
    phone: '+91 98140 12399',
    trade: 'Carpentry',
    certificationLevel: 'Master Artisan Grade 1',
    federationName: 'Northern Woodworkers Guild',
    memberSinceYear: 2017,
    operationalRadiusKm: 7.0,
    rating: 4.90,
    reviewCount: 210,
    completedJobsCount: 490,
    acceptanceRate: 96,
    dailyJobCap: 4,
    dailyJobsCompleted: 3,
    todayPayout: 1440,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Punjab & Haryana Police registry. Valid through 2027.',
    skillCertificationDetails: 'Guild Master Craftsman Certification in architectural door leveling and furniture restoration.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Senior executive member of Northern Woodworkers Cooperative.',
    skills: ['Door Alignment', 'Hydraulic Hinges', 'Drawer Slide Replacement', 'Modular Kitchen Hardware', 'Antique Restoration'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['carpentry'],
    summary: 'Third-generation craftsman focusing on architectural door framing, hydraulic hinge replacement, and long-lasting hardwood repairs.',
    hourlyRate: 360,
    primaryServiceId: 'carpentry'
  },
  {
    id: 'worker-4',
    memberId: 'BSS-CAR-2020-0789',
    name: 'Lakshmi Anantham',
    avatarInitials: 'LA',
    phone: '+91 98450 78912',
    trade: 'Elder Care',
    certificationLevel: 'Certified Clinical Aide',
    federationName: 'Bengaluru Seva Sahakara',
    memberSinceYear: 2020,
    operationalRadiusKm: 4.5,
    rating: 4.98,
    reviewCount: 96,
    completedJobsCount: 230,
    acceptanceRate: 100,
    dailyJobCap: 3,
    dailyJobsCompleted: 1,
    todayPayout: 650,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Karnataka State Police Criminal Verification Cell.',
    skillCertificationDetails: 'Geriatric Patient Care Certificate (St. John) & NCCT Cooperative Healthcare Protocol.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Community health mutual worker representative.',
    skills: ['Mobility Support', 'Post-Op Care', 'Daily Vitals Tracking', 'Elderly Companionship', 'Medication Management'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['elder-care'],
    summary: 'Trained caregiver with certified clinical nursing assistant background. Patient, compassionate, and skilled in gentle post-hospitalization rehab.',
    hourlyRate: 420,
    primaryServiceId: 'elder-care'
  },
  {
    id: 'worker-5',
    memberId: 'KKS-PNT-2021-0315',
    name: 'Subir Kumar Mondal',
    avatarInitials: 'SM',
    phone: '+91 98301 67890',
    trade: 'Painting',
    certificationLevel: 'Surface Specialist L4',
    federationName: 'Kolkata Karmi Samabaya',
    memberSinceYear: 2021,
    operationalRadiusKm: 6.5,
    rating: 4.85,
    reviewCount: 115,
    completedJobsCount: 280,
    acceptanceRate: 94,
    dailyJobCap: 3,
    dailyJobsCompleted: 2,
    todayPayout: 920,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Kolkata Police Commissionerate.',
    skillCertificationDetails: 'National Skill Development Corporation Painter L4 & Samabaya Quality Audit.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Samabaya material bank authorized applicator.',
    skills: ['Wall Texturing', 'Waterproofing Barrier', 'Touch-up Coats', 'Putty Surface Prep', 'Anti-fungal Primer'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['painting'],
    summary: 'Skilled painting technician with deep knowledge of anti-fungal primers, damp barrier treatments, and zero-VOC indoor paints.',
    hourlyRate: 320,
    primaryServiceId: 'painting'
  },
  {
    id: 'worker-6',
    memberId: 'NCS-MOV-2018-0914',
    name: 'Devendra Yadav',
    avatarInitials: 'DY',
    phone: '+91 98110 55432',
    trade: 'Moving & Driving',
    certificationLevel: 'Commercial Logistics Lead',
    federationName: 'NCR Chalak Sahakari',
    memberSinceYear: 2018,
    operationalRadiusKm: 12.0,
    rating: 4.92,
    reviewCount: 260,
    completedJobsCount: 540,
    acceptanceRate: 97,
    dailyJobCap: 3,
    dailyJobsCompleted: 1,
    todayPayout: 1200,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Delhi Police Traffic & Commercial Verification Branch.',
    skillCertificationDetails: 'Commercial Heavy Vehicle Badge & Federation Transport Safety Standard.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Fleet coordinator for NCR Chalak cooperative pool.',
    skills: ['Apartment Shifting', 'Heavy Item Transport', 'Safe Packaging', 'Interstate Logistics', 'Appliance Rigging'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['moving'],
    summary: 'Commercial vehicle specialist and logistics lead with 12 years of zero-breakage track record in household goods relocation.',
    hourlyRate: 400,
    primaryServiceId: 'moving'
  },
  {
    id: 'worker-7',
    memberId: 'TNV-DOM-2020-0431',
    name: 'Meenakshi Sundaram',
    avatarInitials: 'MS',
    phone: '+91 94440 98765',
    trade: 'Domestic Help',
    certificationLevel: 'Sanitation Grade A',
    federationName: 'Tamil Nadu Vettiyaalar Kooturavu',
    memberSinceYear: 2020,
    operationalRadiusKm: 5.0,
    rating: 4.91,
    reviewCount: 175,
    completedJobsCount: 395,
    acceptanceRate: 98,
    dailyJobCap: 4,
    dailyJobsCompleted: 2,
    todayPayout: 850,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Greater Chennai Police.',
    skillCertificationDetails: 'Kooturavu Sanitation Grade A & Health & Hygiene Verified certification.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Women mutual welfare fund secretary.',
    skills: ['Floor Sanitization', 'Deep Kitchen Scrubbing', 'Linen Hygiene', 'Eco-Friendly Cleaning', 'Appliance Degreasing'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['domestic-help'],
    summary: 'Experienced residential hygiene professional trained in enzymatic non-toxic cleaning methods, food-safe surface sanitization, and laundry care.',
    hourlyRate: 300,
    primaryServiceId: 'domestic-help'
  },
  {
    id: 'worker-8',
    memberId: 'HSS-APP-2019-0651',
    name: 'Rajeshwar Rao',
    avatarInitials: 'RR',
    phone: '+91 98490 23456',
    trade: 'Appliance Repair',
    certificationLevel: 'HVAC & White Goods Specialist',
    federationName: 'Hyderabad Shramik Sangham',
    memberSinceYear: 2019,
    operationalRadiusKm: 7.0,
    rating: 4.87,
    reviewCount: 140,
    completedJobsCount: 310,
    acceptanceRate: 95,
    dailyJobCap: 4,
    dailyJobsCompleted: 2,
    todayPayout: 1100,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Hyderabad City Police Commissionerate.',
    skillCertificationDetails: 'Refrigeration & Air Conditioning License & Sangham Technical Council accreditation.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Sangham cooperative tool library board trustee.',
    skills: ['AC Condenser Diagnosis', 'Washing Machine Motors', 'Microwave Magnetrons', 'RO Membrane Change', 'Refrigerator Compressors'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['appliance-repair'],
    summary: 'Senior appliance technician experienced across all major Indian and international domestic white-goods brands.',
    hourlyRate: 390,
    primaryServiceId: 'appliance-repair'
  },
  {
    id: 'worker-9',
    memberId: 'UPP-GAR-2022-0199',
    name: 'Geeta Devi',
    avatarInitials: 'GD',
    phone: '+91 94500 87654',
    trade: 'Gardening',
    certificationLevel: 'Horticulturist L3',
    federationName: 'UP Paryavaran Sewa Sahakari',
    memberSinceYear: 2022,
    operationalRadiusKm: 6.0,
    rating: 4.94,
    reviewCount: 88,
    completedJobsCount: 172,
    acceptanceRate: 99,
    dailyJobCap: 3,
    dailyJobsCompleted: 1,
    todayPayout: 700,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by UP Police Citizen Verification Cell.',
    skillCertificationDetails: 'Urban Forestry Cooperative Certificate & Organic Farming Council Verified.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Native flora seed library coordinator.',
    skills: ['Balcony Planters', 'Organic Compost Soil', 'Neem Pest Prevention', 'Seasonal Pruning', 'Drip Micro-irrigation'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['gardening'],
    summary: 'Horticulturist with deep understanding of native Indian balcony plants, drip irrigation micro-systems, and natural neem pest treatments.',
    hourlyRate: 310,
    primaryServiceId: 'gardening'
  },
  {
    id: 'worker-10',
    memberId: 'RKS-GEN-2018-0819',
    name: 'Abdul Karim',
    avatarInitials: 'AK',
    phone: '+91 94140 34567',
    trade: 'General Repair',
    certificationLevel: 'Multi-Craftsman L4',
    federationName: 'Rajasthan Karigar Samiti',
    memberSinceYear: 2018,
    operationalRadiusKm: 6.0,
    rating: 4.89,
    reviewCount: 156,
    completedJobsCount: 340,
    acceptanceRate: 97,
    dailyJobCap: 4,
    dailyJobsCompleted: 2,
    todayPayout: 950,
    policeVerificationStatus: 'CLEARED',
    policeVerificationDetails: 'Verified by Jaipur Police Commissionerate.',
    skillCertificationDetails: 'Multi-Trade Craftsman Registry & Samiti Quality Assurance Seal.',
    ncctStanding: 'GOOD STANDING',
    ncctDetails: 'Karigar Samiti emergency mutual fund member.',
    skills: ['Wall Bracket Anchors', 'Tile Grout Restoration', 'Window Mesh Fitting', 'Minor Plastering', 'Door Handle Latches'],
    photoUrl: WORKER_PHOTO_BY_SERVICE['general-repair'],
    summary: 'General handyman and mason skilled in structural drywall fasteners, tile replacements, water sealant caulking, and general household installations.',
    hourlyRate: 340,
    primaryServiceId: 'general-repair'
  }
];

// Helper to compute initials from a name
export function getInitials(name: string): string {
  if (!name) return 'SP';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Convert Firestore worker document into WorkerProfile
export function mapFirestoreWorkerDoc(id: string, data: Record<string, any>): WorkerProfile {
  const primaryServiceId = (data.primaryServiceId || 'general-repair') as JobCategory;
  const fallback = DEFAULT_WORKERS.find(w => w.primaryServiceId === primaryServiceId) || DEFAULT_WORKERS[0];
  const isDefaultWorker = DEFAULT_WORKERS.some(w => w.id === id);

  const name = data.name || fallback.name;
  const trade = data.primaryServiceName || JOB_CATEGORY_LABELS[primaryServiceId] || data.trade || fallback.trade;
  const memberId = data.registrationNumber || data.memberId || (isDefaultWorker ? fallback.memberId : `DSF-${id.slice(0, 8).toUpperCase()}`);
  const federationName = data.federationName || fallback.federationName;
  const memberSinceYear = typeof data.memberSinceYear === 'number' 
    ? data.memberSinceYear 
    : (isDefaultWorker ? fallback.memberSinceYear : 2026);
  
  // Rating and review count: Default seed workers have initial reviews; new/custom workers start at 0
  const rating = typeof data.rating === 'number' 
    ? data.rating 
    : (isDefaultWorker ? fallback.rating : 0);
  const reviewCount = typeof data.reviewCount === 'number' 
    ? data.reviewCount 
    : (isDefaultWorker ? fallback.reviewCount : 0);
  
  // Completed jobs: If data specifies it, use it. If it's a seed worker, use fallback; otherwise strictly 0
  const completedJobsCount = typeof data.completedJobsCount === 'number' 
    ? data.completedJobsCount 
    : typeof data.completedJobs === 'number' 
    ? data.completedJobs 
    : (isDefaultWorker ? fallback.completedJobsCount : 0);

  const skills: string[] = Array.isArray(data.subservices) && data.subservices.length > 0 
    ? data.subservices 
    : (Array.isArray(data.skills) && data.skills.length > 0 ? data.skills : fallback.skills);

  const photoUrl = data.photoUrl || WORKER_PHOTO_BY_SERVICE[primaryServiceId] || fallback.photoUrl;
  const summary = data.summary || fallback.summary;
  const hourlyRate = typeof data.hourlyRate === 'number' ? data.hourlyRate : fallback.hourlyRate;
  const isOnline = typeof data.isOnline === 'boolean' ? data.isOnline : false;
  const status = data.status as WorkerProfile['status'];
  const rejectionReason = data.rejectionReason as string | undefined;

  // Daily shift jobs completed and today payout: strictly 0 for new workers unless explicitly set
  const dailyJobsCompleted = typeof data.dailyJobsCompleted === 'number'
    ? data.dailyJobsCompleted
    : (isDefaultWorker ? fallback.dailyJobsCompleted : 0);

  const todayPayout = typeof data.todayPayout === 'number'
    ? data.todayPayout
    : (isDefaultWorker ? fallback.todayPayout : 0);

  const acceptanceRate = typeof data.acceptanceRate === 'number'
    ? data.acceptanceRate
    : (isDefaultWorker ? fallback.acceptanceRate : 100);

  const dailyJobCap = typeof data.dailyJobCap === 'number'
    ? data.dailyJobCap
    : (isDefaultWorker ? fallback.dailyJobCap : 4);

  return {
    id,
    memberId,
    name,
    avatarInitials: getInitials(name),
    phone: data.phone || fallback.phone,
    trade,
    certificationLevel: Array.isArray(data.certifications) && data.certifications[0] 
      ? data.certifications[0] 
      : fallback.certificationLevel,
    federationName,
    memberSinceYear,
    operationalRadiusKm: typeof data.operationalRadiusKm === 'number' ? data.operationalRadiusKm : fallback.operationalRadiusKm,
    rating,
    reviewCount,
    completedJobsCount,
    acceptanceRate,
    dailyJobCap,
    dailyJobsCompleted,
    todayPayout,
    policeVerificationStatus: data.policeVerified === true ? 'CLEARED' : (status === 'pending' ? 'PENDING' : (data.policeVerificationStatus || (isDefaultWorker ? fallback.policeVerificationStatus : 'PENDING'))),
    policeVerificationDetails: data.policeVerificationDetails || (status === 'pending' ? 'Pending verification by Police Central Registry.' : (isDefaultWorker ? fallback.policeVerificationDetails : 'Police verification in progress.')),
    skillCertificationDetails: Array.isArray(data.certifications) && data.certifications.length > 0
      ? data.certifications.join(' · ')
      : fallback.skillCertificationDetails,
    ncctStanding: status === 'pending' ? 'IN REVIEW' : (data.ncctStanding || (isDefaultWorker ? fallback.ncctStanding : 'APPLICANT')),
    ncctDetails: data.ncctDetails || (status === 'pending' ? 'Federation membership applicant file awaiting cooperative committee confirmation.' : (isDefaultWorker ? fallback.ncctDetails : 'Cooperative membership record pending.')),
    skills,
    photoUrl,
    summary,
    hourlyRate,
    primaryServiceId,
    isOnline,
    status,
    rejectionReason,
    certifications: Array.isArray(data.certifications) ? data.certifications : undefined,
    toolsEquipped: Array.isArray(data.toolsEquipped) ? data.toolsEquipped : undefined,
    emergencyAvailable: typeof data.emergencyAvailable === 'boolean' ? data.emergencyAvailable : undefined,
    aadhaarNumber: data.aadhaarNumber,
    panNumber: data.panNumber,
    bankAccount: data.bankAccount,
    ifscCode: data.ifscCode
  };
}

/**
 * Subscribe to the shared Firestore "workers" collection in real time.
 * If empty or pending, delivers DEFAULT_WORKERS immediately.
 */
export function subscribeToWorkers(
  onUpdate: (workers: WorkerProfile[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const workersCol = collection(db, 'workers');
    return onSnapshot(
      workersCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const fetchedWorkers = snapshot.docs.map(docSnap => 
            mapFirestoreWorkerDoc(docSnap.id, docSnap.data())
          );
          // Sort by numeric id: worker-1, worker-2, ..., worker-10
          fetchedWorkers.sort((a, b) => {
            const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
            const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
            return numA - numB;
          });
          onUpdate(fetchedWorkers);
        } else {
          onUpdate(DEFAULT_WORKERS);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'workers');
        onUpdate(DEFAULT_WORKERS);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    onUpdate(DEFAULT_WORKERS);
    return () => {};
  }
}

/**
 * Fetch worker reviews if present in doc
 */
export async function getWorkerReviews(workerId: string): Promise<CustomerReview[] | null> {
  try {
    const workerDoc = await getDoc(doc(db, 'workers', workerId));
    if (workerDoc.exists()) {
      const data = workerDoc.data();
      if (Array.isArray(data.reviews) && data.reviews.length > 0) {
        return data.reviews.map((r: any, index: number) => ({
          id: r.id || `rev-${workerId}-${index}`,
          citizenName: r.customerName || 'Citizen Resident',
          citizenArea: r.area || 'Cooperative Zone',
          date: r.date || 'Recent',
          serviceType: r.serviceRendered || 'General Service',
          rating: typeof r.rating === 'number' ? r.rating : 5,
          comment: r.comment || 'Punctual, verified federation member.',
          tags: ['Federation Verified', 'Punctual']
        }));
      }
    }
  } catch (e) {
    console.warn('Could not fetch worker reviews:', e);
  }
  return null;
}

/**
 * Updates the worker's duty online/offline availability in Firestore.
 * Document: workers/{workerId} -> { isOnline: boolean }
 */
export async function updateWorkerOnlineStatus(workerId: string, isOnline: boolean): Promise<void> {
  if (!workerId) return;
  const workerRef = doc(db, 'workers', workerId);
  try {
    // setDoc with merge: true ensures field is created/updated without overwriting other worker data
    await setDoc(workerRef, { isOnline, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `workers/${workerId}`);
    throw error;
  }
}

/**
 * Fetches the worker's current isOnline status from their Firestore document.
 * Returns boolean if present in the document, or null if not set or document missing.
 */
export async function getWorkerOnlineStatus(workerId: string): Promise<boolean | null> {
  if (!workerId) return null;
  try {
    const workerRef = doc(db, 'workers', workerId);
    const snap = await getDoc(workerRef);
    if (snap.exists()) {
      const data = snap.data();
      if (typeof data.isOnline === 'boolean') {
        return data.isOnline;
      }
    }
  } catch (error) {
    console.warn(`Could not read isOnline status for worker ${workerId}:`, error);
  }
  return null;
}

/**
 * Subscribes to real-time changes in a worker's isOnline status.
 */
export function subscribeToWorkerOnlineStatus(
  workerId: string,
  onUpdate: (isOnline: boolean) => void
): () => void {
  if (!workerId) return () => {};
  try {
    const workerRef = doc(db, 'workers', workerId);
    return onSnapshot(
      workerRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.isOnline === 'boolean') {
            onUpdate(data.isOnline);
          }
        }
      },
      (error) => {
        console.warn(`Error listening to isOnline for worker ${workerId}:`, error);
      }
    );
  } catch {
    return () => {};
  }
}

/**
 * Live-subscribes to a single worker's document in Firestore.
 * Updates in real-time when Admin updates verification status (pending -> approved/rejected/held).
 */
export function subscribeToWorkerDoc(
  workerId: string,
  onUpdate: (worker: WorkerProfile) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!workerId) return () => {};
  try {
    const workerRef = doc(db, 'workers', workerId);
    return onSnapshot(
      workerRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const worker = mapFirestoreWorkerDoc(snapshot.id, snapshot.data());
          onUpdate(worker);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `workers/${workerId}`);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    if (onError && err instanceof Error) onError(err);
    return () => {};
  }
}

export interface NewWorkerRegistrationInput {
  name: string;
  phone: string;
  primaryServiceId: JobCategory;
  primaryServiceName?: string;
  subservices: string[];
  hourlyRate: number;
  federationName: string;
  memberSinceYear: number;
  summary: string;
  certifications: string[];
  toolsEquipped: string[];
  emergencyAvailable: boolean;
  photoUrl: string;
  aadhaarNumber?: string;
  panNumber?: string;
  bankAccount?: string;
  ifscCode?: string;
  registrationNumber?: string;
  operationalRadiusKm?: number;
}

/**
 * Creates a brand new worker document in Firestore with an auto-generated ID.
 * Sets status: 'pending', isOnline: false, rating: 0, completedJobs: 0, etc.
 */
export async function registerNewWorker(input: NewWorkerRegistrationInput): Promise<WorkerProfile> {
  const tradeSlug = input.primaryServiceId;
  const tradeCode = tradeSlug.slice(0, 3).toUpperCase();
  const year = input.memberSinceYear || 2026;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const registrationNumber = input.registrationNumber || `DSF-${tradeCode}-${year}-${randomSuffix}`;
  const primaryServiceName = JOB_CATEGORY_LABELS[input.primaryServiceId] || tradeSlug;

  const docPayload = {
    name: input.name.trim(),
    phone: input.phone.trim(),
    primaryServiceId: tradeSlug,
    primaryServiceName,
    subservices: input.subservices.map(s => s.trim()).filter(Boolean),
    certifications: input.certifications.map(c => c.trim()).filter(Boolean),
    toolsEquipped: input.toolsEquipped.map(t => t.trim()).filter(Boolean),
    registrationNumber,
    federationName: input.federationName || 'Delhi Shramik Federation',
    memberSinceYear: year,
    policeVerified: false,
    insuranceActive: true,
    hourlyRate: Number(input.hourlyRate) || 400,
    summary: input.summary ? input.summary.trim() : '',
    photoUrl: input.photoUrl || '',
    emergencyAvailable: Boolean(input.emergencyAvailable),
    isOnline: false,
    rating: 0,
    reviewCount: 0,
    completedJobs: 0,
    completedJobsCount: 0,
    dailyJobsCompleted: 0,
    todayPayout: 0,
    dailyJobCap: 4,
    acceptanceRate: 100,
    reviews: [],
    status: 'pending',
    aadhaarNumber: input.aadhaarNumber || 'XXXX-XXXX-8921',
    panNumber: input.panNumber || 'ABCDE1234F',
    bankAccount: input.bankAccount || '•••• •••• •••• 4519',
    ifscCode: input.ifscCode || 'SBIN0001234',
    operationalRadiusKm: Number(input.operationalRadiusKm) || 5.0,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'workers'), docPayload);
    return mapFirestoreWorkerDoc(docRef.id, {
      ...docPayload,
      id: docRef.id
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'workers');
    throw error;
  }
}


