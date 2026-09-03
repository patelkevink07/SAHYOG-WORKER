/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ScreenType, 
  JobRequest, 
  ActiveJobSession, 
  WorkerProfile, 
  StepState 
} from './types';
import { 
  INITIAL_WORKER, 
  INITIAL_INCOMING_JOBS, 
  WELFARE_BENEFITS, 
  SETTLEMENT_HISTORY, 
  CUSTOMER_REVIEWS 
} from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { JobDetailScreen } from './screens/JobDetailScreen';
import { ActiveJobScreen } from './screens/ActiveJobScreen';
import { EarningsScreen } from './screens/EarningsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEYS = {
  IS_LOGGED_IN: 'sahyog_worker_logged_in',
  IS_ONLINE: 'sahyog_worker_online',
  CURRENT_SCREEN: 'sahyog_worker_screen',
  INCOMING_JOBS: 'sahyog_worker_incoming_jobs',
  ACTIVE_SESSION: 'sahyog_worker_active_session',
  WORKER_PROFILE: 'sahyog_worker_profile',
  WEEK_EARNINGS: 'sahyog_worker_week_earnings'
};

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Storage access blocked in sandboxed iframe or private browsing
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  }
};

export default function App() {
  // 1. Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return saved !== null ? saved === 'true' : true; // Default to true so user immediately sees dashboard
  });

  // 2. Online / Offline Duty Availability (Most visually prominent control)
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.IS_ONLINE);
    return saved !== null ? saved === 'true' : true;
  });

  // 3. Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.CURRENT_SCREEN) as ScreenType;
    return (saved && ['dashboard', 'job_detail', 'active_job', 'earnings', 'profile', 'reviews'].includes(saved)) 
      ? saved 
      : 'dashboard';
  });

  // 4. Worker Profile State
  const [worker, setWorker] = useState<WorkerProfile>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.WORKER_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_WORKER, ...parsed };
      }
    } catch {}
    return INITIAL_WORKER;
  });

  // 5. Incoming Job Requests Queue
  const [incomingJobs, setIncomingJobs] = useState<JobRequest[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.INCOMING_JOBS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_INCOMING_JOBS;
  });

  // 6. Selected Job for Detail View
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);

  // 7. Active Job Session State
  const [activeSession, setActiveSession] = useState<ActiveJobSession | null>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.job) {
          return parsed;
        }
      }
    } catch {}
    // Pre-populate with job-1 in progress step 3 to match prototype screenshot, or active
    return {
      job: INITIAL_INCOMING_JOBS[0],
      currentStep: 3,
      startedAt: '14:15',
      stepTimestamps: {
        enRouteAt: '14:02',
        arrivedAt: '14:12',
        startedAt: '14:15'
      },
      checklist: [
        { id: 'chk-1', text: 'Isolate main stopcock valve before brazing', done: true },
        { id: 'chk-2', text: 'Check 1/2 inch copper compression coupler fitting', done: true },
        { id: 'chk-3', text: 'Run pressure test for 3 minutes before departure', done: false }
      ]
    };
  });

  // 8. Financial earnings state
  const [currentWeekTotal, setCurrentWeekTotal] = useState<number>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.WEEK_EARNINGS);
      return saved ? parseInt(saved, 10) : 8450;
    } catch {
      return 8450;
    }
  });

  // 9. Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.IS_ONLINE, String(isOnline));
  }, [isOnline]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.CURRENT_SCREEN, currentScreen);
  }, [currentScreen]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.INCOMING_JOBS, JSON.stringify(incomingJobs));
  }, [incomingJobs]);

  useEffect(() => {
    if (activeSession) {
      safeStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    } else {
      safeStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  }, [activeSession]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.WORKER_PROFILE, JSON.stringify(worker));
  }, [worker]);

  useEffect(() => {
    safeStorage.setItem(STORAGE_KEYS.WEEK_EARNINGS, String(currentWeekTotal));
  }, [currentWeekTotal]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2800);
  };

  // Availability Toggle Handler
  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (nextState) {
      showToast("You're online. Dispatch pool active.");
    } else {
      showToast("You're offline. No incoming dispatches.");
    }
  };

  // Job Actions
  const handleAcceptJob = (job: JobRequest) => {
    // Remove from queue
    setIncomingJobs((prev) => prev.filter((j) => j.id !== job.id));

    // Create active session
    const newSession: ActiveJobSession = {
      job,
      currentStep: 1, // On the way
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stepTimestamps: {
        enRouteAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      checklist: [
        { id: 'c1', text: 'Confirm site address and customer identity on arrival', done: false },
        { id: 'c2', text: 'Conduct initial technical inspection & quote verification', done: false },
        { id: 'c3', text: 'Execute service according to Labour Federation standard tariffs', done: false },
        { id: 'c4', text: 'Conduct post-repair pressure/function verification test', done: false }
      ]
    };

    setActiveSession(newSession);
    setCurrentScreen('active_job');
    setSelectedJob(null);
    showToast(`Accepted: ${job.title}. Switched to Active job.`);
  };

  const handleRejectJob = (jobId: string) => {
    setIncomingJobs((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedJob?.id === jobId) {
      setSelectedJob(null);
      setCurrentScreen('dashboard');
    }
    showToast('Job passed to adjacent federation partner.');
  };

  const handleViewJobDetail = (job: JobRequest) => {
    setSelectedJob(job);
    setCurrentScreen('job_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Stepper Advance in Active Job
  const handleAdvanceStep = () => {
    if (!activeSession) return;
    const nextStep = (activeSession.currentStep + 1) as StepState;

    if (nextStep <= 4) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedTimestamps = { ...activeSession.stepTimestamps };
      if (nextStep === 2) updatedTimestamps.arrivedAt = now;
      if (nextStep === 3) updatedTimestamps.startedAt = now;
      if (nextStep === 4) updatedTimestamps.completedAt = now;

      setActiveSession({
        ...activeSession,
        currentStep: nextStep,
        stepTimestamps: updatedTimestamps
      });

      if (nextStep === 4) {
        // Credit payout immediately
        const addedAmount = activeSession.job.price;
        setCurrentWeekTotal((prev) => prev + addedAmount);
        setWorker((prev) => ({
          ...prev,
          dailyJobsCompleted: prev.dailyJobsCompleted + 1,
          todayPayout: prev.todayPayout + addedAmount,
          completedJobsCount: prev.completedJobsCount + 1
        }));
        showToast(`Job complete. ₹${addedAmount} added to this week's earnings.`);
      } else if (nextStep === 2) {
        showToast('Arrived at citizen site.');
      } else if (nextStep === 3) {
        showToast('Service started.');
      }
    }
  };

  const handleCompleteActiveJob = () => {
    setActiveSession(null);
    setCurrentScreen('dashboard');
    showToast('Returned to job broadcast pool.');
  };

  const handleToggleChecklist = (itemId: string) => {
    if (!activeSession) return;
    setActiveSession({
      ...activeSession,
      checklist: activeSession.checklist.map((item) => 
        item.id === itemId ? { ...item, done: !item.done } : item
      )
    });
  };

  const handleUpdateRadius = (radius: number) => {
    setWorker((prev) => ({
      ...prev,
      operationalRadiusKm: radius
    }));
    showToast(`Operational radius updated to ${radius.toFixed(1)} km.`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Signed out of session.');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    showToast(`Welcome, ${worker.name}. Duty ready.`);
  };

  // If not logged in, show Login Screen (minimal & fast)
  if (!isLoggedIn) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#14181F] flex flex-col antialiased selection:bg-[#1F4D3D] selection:text-[#FFFFFF]">
      {/* Top Header */}
      <Header
        worker={worker}
        isOnline={isOnline}
        onOpenReviews={() => {
          setCurrentScreen('reviews');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateHome={() => {
          setCurrentScreen('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container: Max 72rem fluid container with phone-first padding */}
      <main className="flex-1 w-full max-w-[72rem] mx-auto px-4 md:px-6 pt-4 pb-20">
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            worker={worker}
            isOnline={isOnline}
            onToggleOnline={handleToggleOnline}
            incomingJobs={incomingJobs}
            onAcceptJob={handleAcceptJob}
            onRejectJob={handleRejectJob}
            onViewJobDetail={handleViewJobDetail}
            onNavigateToActive={() => setCurrentScreen('active_job')}
            hasActiveJob={!!activeSession}
          />
        )}

        {currentScreen === 'job_detail' && (
          selectedJob ? (
            <JobDetailScreen
              job={selectedJob}
              onBack={() => setCurrentScreen('dashboard')}
              onAccept={handleAcceptJob}
              onReject={handleRejectJob}
            />
          ) : (
            <DashboardScreen
              worker={worker}
              isOnline={isOnline}
              onToggleOnline={handleToggleOnline}
              incomingJobs={incomingJobs}
              onAcceptJob={handleAcceptJob}
              onRejectJob={handleRejectJob}
              onViewJobDetail={handleViewJobDetail}
              onNavigateToActive={() => setCurrentScreen('active_job')}
              hasActiveJob={!!activeSession}
            />
          )
        )}

        {currentScreen === 'active_job' && (
          <ActiveJobScreen
            activeSession={activeSession}
            onAdvanceStep={handleAdvanceStep}
            onCompleteJob={handleCompleteActiveJob}
            onToggleChecklistItem={handleToggleChecklist}
            onReturnToJobs={() => setCurrentScreen('dashboard')}
          />
        )}

        {currentScreen === 'earnings' && (
          <EarningsScreen
            currentWeekTotal={currentWeekTotal}
            completedJobsCount={worker.completedJobsCount}
            welfareBenefits={WELFARE_BENEFITS}
            settlements={SETTLEMENT_HISTORY}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            worker={worker}
            onUpdateRadius={handleUpdateRadius}
            onLogout={handleLogout}
            onViewReviews={() => setCurrentScreen('reviews')}
          />
        )}

        {currentScreen === 'reviews' && (
          <ReviewsScreen
            worker={worker}
            reviews={CUSTOMER_REVIEWS}
            onBack={() => setCurrentScreen('dashboard')}
          />
        )}

        {/* Global Cross-Portal Minimal Footer */}
        <Footer />
      </main>

      {/* Fixed Bottom Navigation (48px+ touch targets) */}
      <BottomNav
        currentScreen={currentScreen}
        hasActiveJob={!!activeSession}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Factual Toast Notification */}
      {toastMessage && (
        <div 
          id="toast-banner"
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 z-50 bg-[#14181F] text-[#FFFFFF] px-4 py-3 rounded-[8px] text-[13px] font-[500] shadow-lg flex items-center gap-2 max-w-sm border border-[#E7E5E1]/20 transition-all duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-[#A1D1BC] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
