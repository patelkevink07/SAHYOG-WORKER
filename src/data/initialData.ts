import { WorkerProfile, JobRequest, WelfareBenefit, SettlementRecord, CustomerReview } from '../types';

export const INITIAL_WORKER: WorkerProfile = {
  id: 'worker-1',
  memberId: 'REG-DL-8841',
  name: 'Ramesh C. Verma',
  avatarInitials: 'RC',
  phone: '+91 98765 43210',
  trade: 'Senior Master Plumber & Pipeline Technician',
  certificationLevel: 'Level 4 Certified',
  federationName: 'Delhi Shramik Federation',
  memberSinceYear: 2021,
  operationalRadiusKm: 6.0,
  rating: 4.92,
  reviewCount: 214,
  completedJobsCount: 482,
  acceptanceRate: 98,
  dailyJobCap: 4,
  dailyJobsCompleted: 3,
  todayPayout: 1050,
  policeVerificationStatus: 'CLEARED',
  policeVerificationDetails: 'Verified by Delhi Police Central Registry (Mayur Vihar PS). Valid through Dec 2026.',
  skillCertificationDetails: 'National Skill Development Corp (NSDC) & Cooperatives Skill Council Level 4 accreditation.',
  ncctStanding: 'GOOD STANDING',
  ncctDetails: 'Delhi State Cooperative Federation voting shareholder with full mutual welfare ledger access.',
  skills: [
    'Emergency Pipe Brazing',
    'Main Stopcock Servicing',
    'High-Pressure Water Pumps',
    'Sanitary & Basin Mixers',
    'Kitchen Trap Snake Clearance',
    'CPVC/GI Pipeline Concealment'
  ]
};

export const INITIAL_INCOMING_JOBS: JobRequest[] = [
  {
    id: 'job-1',
    title: 'Plumbing · Main Pipe Valve Leakage',
    category: 'Plumbing',
    urgency: 'Emergency',
    urgencyLabel: 'Direct Citizen Request',
    customerName: 'Ananya Sharma',
    customerPhone: '+91 98101 23456',
    address: 'Flat 402, Block C, Pocket 2, Mayur Vihar Phase 1, New Delhi',
    area: 'Mayur Vihar Phase 1',
    distanceKm: 1.8,
    timeWindow: 'Within 25 mins',
    price: 450,
    priceType: 'Fixed Federation Tariff',
    description: 'Water line joint rupture near water meter. Continuous leakage threatening ground floor hallway.',
    notes: 'Please bring 1/2-inch copper couplers and compression seal tape. Water shutoff key is with ground floor guard.',
    materialsProvided: true,
    status: 'pending',
    timestamp: '5m ago'
  },
  {
    id: 'job-2',
    title: 'Sanitary Installation',
    category: 'Plumbing',
    urgency: 'Scheduled',
    urgencyLabel: 'Scheduled Slot',
    customerName: 'Devendra Malik',
    customerPhone: '+91 98712 34567',
    address: 'Tower 4, Flat 9B, Apex Apartments, IP Extension, Patparganj',
    area: 'IP Extension, Patparganj',
    distanceKm: 3.2,
    timeWindow: 'Slot: 02:30 PM today',
    price: 600,
    priceType: 'Estimated Payout',
    description: 'Installation of dual sink mixers and flex-pipe connectors. Materials already purchased on-site.',
    notes: 'Both Kohler sink faucets and flex pipes are kept ready on kitchen counter. Need installation and cold/hot line balancing.',
    materialsProvided: true,
    status: 'pending',
    timestamp: '18m ago'
  },
  {
    id: 'job-3',
    title: 'Drain Blockage Clearance',
    category: 'Plumbing',
    urgency: 'Standard',
    urgencyLabel: 'Standard Booking',
    customerName: 'Sunita Rao',
    customerPhone: '+91 98114 98765',
    address: 'House 54, Ground Floor, Vikas Marg, Preet Vihar',
    area: 'Preet Vihar, Vikas Marg',
    distanceKm: 4.0,
    timeWindow: 'Within 1 hour',
    price: 350,
    priceType: 'Estimated Payout',
    description: 'Kitchen trap slow drainage. Requires mechanical snake tool clearance.',
    notes: 'Double drain under the kitchen sink smells bad and water empties very slowly after washing dishes.',
    materialsProvided: false,
    status: 'pending',
    timestamp: '32m ago'
  },
  {
    id: 'job-4',
    title: 'Overhead Tank Float Valve Replacement',
    category: 'Plumbing',
    urgency: 'Standard',
    urgencyLabel: 'Standard Booking',
    customerName: 'Harish Chander',
    customerPhone: '+91 98188 11223',
    address: 'B-12, Gali No. 3, Shakarpur Main Market, Laxmi Nagar',
    area: 'Shakarpur, Laxmi Nagar',
    distanceKm: 5.1,
    timeWindow: 'Within 2 hours',
    price: 400,
    priceType: 'Fixed Federation Tariff',
    description: 'Rooftop water tank overflowing when municipal pump runs. Brass float valve jammed.',
    notes: 'Rooftop access via internal stairway. New 1-inch brass ballcock valve already bought.',
    materialsProvided: true,
    status: 'pending',
    timestamp: '45m ago'
  }
];

export const WELFARE_BENEFITS: WelfareBenefit[] = [
  {
    id: 'welfare-1',
    title: 'Solidarity Health Pool Contribution',
    description: 'Emergency hospitalization cover for partner and dependents up to ₹3,00,000 per year at cashless network cooperative dispensaries.',
    deductionAmount: 120,
    status: 'Active & Covered',
    category: 'health'
  },
  {
    id: 'welfare-2',
    title: 'Tool Upgrade Micro-Escrow',
    description: 'Autonomous zero-commission personal savings fund for tool replacements, Bosch rotary equipment, and safety gear maintenance.',
    deductionAmount: 80,
    status: 'Pool: ₹1,840 accumulated',
    category: 'tools'
  },
  {
    id: 'welfare-3',
    title: 'NCCT Accidental Cover',
    description: 'Statutory on-duty disability and accidental death cover under National Council for Cooperative Training (Policy #DL-SHR-2021-998).',
    deductionAmount: 'Sponsored',
    status: 'Federation Paid · Active',
    category: 'insurance'
  },
  {
    id: 'welfare-4',
    title: 'Cooperative Pension & Gratuity Mutual Reserve',
    description: 'Monthly matching cooperative gratuity credit for workers completing >15 duty shifts each month.',
    deductionAmount: 'Sponsored',
    status: 'Accumulated: ₹14,200',
    category: 'pension'
  }
];

export const SETTLEMENT_HISTORY: SettlementRecord[] = [
  {
    id: 'txn-1',
    reference: 'COOP-TXN-88192',
    bankAccount: 'HDFC Bank ****4102',
    date: 'Oct 18, 2024 · 18:00',
    amount: 7920,
    status: 'Settled',
    jobsCount: 16
  },
  {
    id: 'txn-2',
    reference: 'COOP-TXN-87401',
    bankAccount: 'HDFC Bank ****4102',
    date: 'Oct 11, 2024 · 18:00',
    amount: 8100,
    status: 'Settled',
    jobsCount: 17
  },
  {
    id: 'txn-3',
    reference: 'COOP-TXN-86690',
    bankAccount: 'HDFC Bank ****4102',
    date: 'Oct 04, 2024 · 18:00',
    amount: 7450,
    status: 'Settled',
    jobsCount: 15
  }
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    citizenName: 'Ananya Sharma',
    citizenArea: 'Mayur Vihar Phase 1',
    date: 'Yesterday, 17:40',
    serviceType: 'Emergency Pipeline Repair',
    rating: 5,
    comment: 'Arrived in less than 20 minutes with full brazing kit. Quickly identified the split joint, isolated the water meter, and fixed it without unnecessary demolition. Very calm and polite.',
    tags: ['Prompt Arrival', 'Fair Federation Tariff', 'Clean Work']
  },
  {
    id: 'rev-2',
    citizenName: 'Rajesh Khanna',
    citizenArea: 'IP Extension',
    date: '3 days ago',
    serviceType: 'Bathroom Mixer & Angle Cock Replacement',
    rating: 5,
    comment: 'Ramesh ji explained the wear and tear clearly before replacing the internal ceramic cartridge. No extra bargaining or hidden charges. Exactly as fixed by the federation.',
    tags: ['Transparent Pricing', 'Skill Level 4', 'Punctual']
  },
  {
    id: 'rev-3',
    citizenName: 'Dr. Meenakshi S.',
    citizenArea: 'Preet Vihar',
    date: 'Last week',
    serviceType: 'Kitchen Drain Snaking & De-clogging',
    rating: 5,
    comment: 'Very professional cooperative member. Came with gloves, boot covers, and heavy-duty spiral snake. The drain was completely clear within 25 minutes. Disinfected the area after completion.',
    tags: ['Hygienic', 'Thorough', 'Polite']
  },
  {
    id: 'rev-4',
    citizenName: 'Karan Mehra',
    citizenArea: 'Patparganj',
    date: '2 weeks ago',
    serviceType: 'Main Tank Sensor & Float Valve',
    rating: 4,
    comment: 'Great work fixing the rooftop overhead tank. Had to wait slightly for him to climb up safely, but the repair was solid and zero overflow since.',
    tags: ['Solid Repair', 'Knowledgeable']
  }
];
