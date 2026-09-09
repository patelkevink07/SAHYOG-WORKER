import plumbing from '../worker-plumbing.jpg';
import electrical from '../worker-electrical.jpg';
import carpentry from '../worker-carpentry.jpg';
import painting from '../worker-painting.jpg';
import domesticHelp from '../worker-domestic-help.jpg';
import elderCare from '../worker-elder-care.jpg';
import moving from '../worker-moving.jpg';
import applianceRepair from '../worker-appliance-repair.jpg';
import gardening from '../worker-gardening.jpg';
import generalRepair from '../worker-general-repair.jpg';

export const WORKER_PHOTO_BY_SERVICE: Record<string, string> = {
  'plumbing': plumbing,
  'electrical': electrical,
  'carpentry': carpentry,
  'painting': painting,
  'domestic-help': domesticHelp,
  'elder-care': elderCare,
  'moving': moving,
  'appliance-repair': applianceRepair,
  'gardening': gardening,
  'general-repair': generalRepair,
};

export function getLocalWorkerPhoto(primaryServiceId?: string, trade?: string): string {
  const serviceId = primaryServiceId?.toLowerCase() || '';
  if (serviceId && WORKER_PHOTO_BY_SERVICE[serviceId]) {
    return WORKER_PHOTO_BY_SERVICE[serviceId];
  }
  
  // Try mapping by trade name slug
  const tradeSlug = (trade || '').toLowerCase().trim().replace(/\s+/g, '-');
  if (WORKER_PHOTO_BY_SERVICE[tradeSlug]) {
    return WORKER_PHOTO_BY_SERVICE[tradeSlug];
  }
  
  // Try special matches for trade names
  if (tradeSlug === 'moving-&-driving' || tradeSlug === 'moving-driving') {
    return WORKER_PHOTO_BY_SERVICE['moving'];
  }
  
  // Default fallback
  return WORKER_PHOTO_BY_SERVICE['general-repair'];
}
