export type ScreenType = 
  | 'login'
  | 'dashboard'
  | 'job_detail'
  | 'active_job'
  | 'earnings'
  | 'profile'
  | 'reviews';

export type JobCategory = 
  | 'Plumbing'
  | 'Electrical'
  | 'Carpentry'
  | 'Painting'
  | 'Domestic Help'
  | 'Caregiving'
  | 'Driving'
  | 'Gardening'
  | 'Cleaning'
  | 'Appliance Technician';

export type JobUrgency = 'Emergency' | 'Standard' | 'Scheduled';

export interface JobRequest {
  id: string;
  title: string;
  category: JobCategory;
  urgency: JobUrgency;
  urgencyLabel?: string;
  customerName: string;
  customerPhone: string;
  address: string;
  area: string;
  distanceKm: number;
  timeWindow: string;
  price: number;
  priceType: string;
  description: string;
  notes?: string;
  materialsProvided: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  timestamp: string;
}

export type StepState = 1 | 2 | 3 | 4;
// 1 = On the way (En Route)
// 2 = Arrived
// 3 = In progress
// 4 = Completed

export interface ActiveJobSession {
  job: JobRequest;
  currentStep: StepState;
  startedAt: string;
  stepTimestamps: {
    enRouteAt?: string;
    arrivedAt?: string;
    startedAt?: string;
    completedAt?: string;
  };
  checklist: {
    id: string;
    text: string;
    done: boolean;
  }[];
  completionNote?: string;
}

export interface WorkerProfile {
  id: string;
  memberId: string;
  name: string;
  avatarInitials: string;
  phone: string;
  trade: string;
  certificationLevel: string;
  federationName: string;
  memberSinceYear: number;
  operationalRadiusKm: number;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  acceptanceRate: number;
  dailyJobCap: number;
  dailyJobsCompleted: number;
  todayPayout: number;
  policeVerificationStatus: 'CLEARED' | 'PENDING' | 'EXPIRED';
  policeVerificationDetails: string;
  skillCertificationDetails: string;
  ncctStanding: 'GOOD STANDING' | 'CONDITIONAL' | 'IN REVIEW';
  ncctDetails: string;
  skills: string[];
}

export interface WelfareBenefit {
  id: string;
  title: string;
  description: string;
  deductionAmount: number | 'Sponsored';
  status: string;
  category: 'health' | 'tools' | 'insurance' | 'pension';
}

export interface SettlementRecord {
  id: string;
  reference: string;
  bankAccount: string;
  date: string;
  amount: number;
  status: 'Settled' | 'Processing';
  jobsCount: number;
}

export interface CustomerReview {
  id: string;
  citizenName: string;
  citizenArea: string;
  date: string;
  serviceType: string;
  rating: number;
  comment: string;
  tags: string[];
}
