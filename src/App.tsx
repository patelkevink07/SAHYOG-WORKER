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
import { 
  subscribeToIncomingBookings, 
  updateBookingStatus, 
  testConnection 
} from './lib/bookingService';
import {
  getWorkerOnlineStatus,
  updateWorkerOnlineStatus,
  subscribeToWorkerOnlineStatus
} from './lib/workerService';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { LoginScreen } from './screens/LoginScreen';
import { WorkerSelectionScreen } from './screens/WorkerSelectionScreen';
import { SplashScreen } from './screens/SplashScreen';
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
  ACTIVE_SESSION: 'sahyog_worker_active_session',
  WORKER_PROFILE: 'sahyog_worker_profile',
  WEEK_EARNINGS: 'sahyog_worker_week_earnings'
};

export default function App() {
  // 0. App Launch Splash Screen
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash on fresh initial page load
    const seen = sessionStorage.getItem('sahyog_splash_seen');
    return seen !== 'true';
  });

  // 1. Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    return saved !== null ? saved === 'true' : true; // Default to true so user immediately sees dashboard
  });

  // 2. Online / Offline Duty Availability (Most visually prominent control)
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_ONLINE);
    return saved !== null ? saved === 'true' : true;
  });

  // 3. Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SCREEN) as ScreenType;
    return (saved && ['dashboard', 'job_detail', 'active_job', 'earnings', 'profile', 'reviews', 'worker_select'].includes(saved)) 
      ? saved 
      : 'dashboard';
  });

  // 4. Worker Profile State
  const [worker, setWorker] = useState<WorkerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WORKER_PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_WORKER;
  });

  // 5. Incoming Job Requests Queue (Live-subscribed from Firestore 'bookings' collection)
  const [incomingJobs, setIncomingJobs] = useState<JobRequest[]>([]);

  // 6. Selected Job for Detail View
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);

  // 7. Active Job Session State
  const [activeSession, setActiveSession] = useState<ActiveJobSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
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
    const saved = localStorage.getItem(STORAGE_KEYS.WEEK_EARNINGS);
    return saved ? parseInt(saved, 10) : 8450;
  });

  // 9. Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_ONLINE, String(isOnline));
  }, [isOnline]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SCREEN, currentScreen);
  }, [currentScreen]);

  // Test initial Firestore connection
  useEffect(() => {
    testConnection();
  }, []);

  // 1. Live subscription to Firestore "bookings" collection
  // Filtered where workerId equals this worker's own id AND status equals "requested"
  useEffect(() => {
    if (!worker?.id) return;
    const unsubscribe = subscribeToIncomingBookings(
      worker.id,
      (jobs) => {
        setIncomingJobs(jobs);
      },
      (error) => {
        console.error('Error live-subscribing to incoming bookings:', error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [worker.id]);

  // Live sync of worker's isOnline duty status from the shared Firestore "workers" collection.
  // On app load: if this worker's Firestore doc already has an isOnline value, use that as the initial toggle state.
  useEffect(() => {
    if (!worker?.id) return;
    let isCancelled = false;

    // Fetch initial isOnline status from Firestore document
    getWorkerOnlineStatus(worker.id).then((remoteStatus) => {
      if (!isCancelled && typeof remoteStatus === 'boolean') {
        setIsOnline(remoteStatus);
        localStorage.setItem(STORAGE_KEYS.IS_ONLINE, String(remoteStatus));
      }
    }).catch((err) => {
      console.warn(`Could not read isOnline from Firestore for ${worker.id}:`, err);
    });

    // Also subscribe to real-time status updates for this worker doc
    const unsubscribe = subscribeToWorkerOnlineStatus(worker.id, (remoteStatus) => {
      if (!isCancelled && typeof remoteStatus === 'boolean') {
        setIsOnline(remoteStatus);
        localStorage.setItem(STORAGE_KEYS.IS_ONLINE, String(remoteStatus));
      }
    });

    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [worker.id]);

  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    }
  }, [activeSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WORKER_PROFILE, JSON.stringify(worker));
  }, [worker]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEK_EARNINGS, String(currentWeekTotal));
  }, [currentWeekTotal]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((curr) => (curr === message ? null : curr));
    }, 2800);
  };

  // Availability Toggle Handler: writes new value to worker's doc in Firestore "workers" collection
  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    localStorage.setItem(STORAGE_KEYS.IS_ONLINE, String(nextState));

    if (nextState) {
      showToast("You're online · Status synced to registry.");
    } else {
      showToast("You're offline · Status synced to registry.");
    }

    // Persist to shared Firestore "workers" collection (field name: isOnline, boolean)
    try {
      await updateWorkerOnlineStatus(worker.id, nextState);
    } catch (err) {
      console.error('Failed to sync isOnline status to Firestore:', err);
    }
  };

  // Job Actions
  // 2. When the worker accepts a job, update that booking's status in Firestore to "accepted"
  const handleAcceptJob = async (job: JobRequest) => {
    // Persist accepted status to Firestore
    try {
      await updateBookingStatus(job.id, 'accepted', { workerId: worker.id });
    } catch (err) {
      console.error('Failed to update booking status to accepted in Firestore:', err);
    }

    // Remove from local queue
    setIncomingJobs((prev) => prev.filter((j) => j.id !== job.id));

    // Create active session
    const newSession: ActiveJobSession = {
      job: { ...job, status: 'accepted' },
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

  // 3. When the worker rejects a job, update status to "rejected"
  const handleRejectJob = async (jobId: string) => {
    // Persist rejected status to Firestore
    try {
      await updateBookingStatus(jobId, 'rejected', { workerId: worker.id });
    } catch (err) {
      console.error('Failed to update booking status to rejected in Firestore:', err);
    }

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

  // 4. As the worker advances through job steps (arrived → started → completed),
  // update the booking's status in Firestore to "in_progress" when work starts, and "completed" when finished.
  const handleAdvanceStep = async () => {
    if (!activeSession) return;
    const nextStep = (activeSession.currentStep + 1) as StepState;

    if (nextStep <= 4) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updatedTimestamps = { ...activeSession.stepTimestamps };
      if (nextStep === 2) updatedTimestamps.arrivedAt = now;
      if (nextStep === 3) updatedTimestamps.startedAt = now;
      if (nextStep === 4) updatedTimestamps.completedAt = now;

      // Firestore persistence:
      // "in_progress" when work starts (step 3)
      if (nextStep === 3) {
        try {
          await updateBookingStatus(activeSession.job.id, 'in_progress', { workerId: worker.id });
        } catch (err) {
          console.error('Failed to update booking status to in_progress in Firestore:', err);
        }
      } 
      // "completed" when finished (step 4)
      else if (nextStep === 4) {
        try {
          await updateBookingStatus(activeSession.job.id, 'completed', { workerId: worker.id });
        } catch (err) {
          console.error('Failed to update booking status to completed in Firestore:', err);
        }
      }

      setActiveSession({
        ...activeSession,
        currentStep: nextStep,
        stepTimestamps: updatedTimestamps,
        job: {
          ...activeSession.job,
          status: nextStep === 4 ? 'completed' : nextStep === 3 ? 'in_progress' : activeSession.job.status
        }
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

  const handleCompleteActiveJob = async () => {
    if (activeSession?.job?.id) {
      try {
        await updateBookingStatus(activeSession.job.id, 'completed', { workerId: worker.id });
      } catch (err) {
        console.error('Failed to update booking status to completed in Firestore:', err);
      }
    }
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

  // Switch persona to selected worker
  const handleSelectWorker = (selectedWorker: WorkerProfile) => {
    const isDifferent = selectedWorker.id !== worker.id;
    setWorker(selectedWorker);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
    if (isDifferent) {
      setActiveSession(null);
      setSelectedJob(null);
      setIncomingJobs([]);
      if (typeof selectedWorker.isOnline === 'boolean') {
        setIsOnline(selectedWorker.isOnline);
        localStorage.setItem(STORAGE_KEYS.IS_ONLINE, String(selectedWorker.isOnline));
      }
    }
    showToast(`Switched persona to ${selectedWorker.name} (${selectedWorker.trade}).`);
  };

  // Open worker selection screen
  const handleOpenWorkerSelect = () => {
    setCurrentScreen('worker_select');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('worker_select');
    showToast('Signed out of session. Choose a worker persona.');
  };

  // 0. Initial App Launch Splash Screen
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          sessionStorage.setItem('sahyog_splash_seen', 'true');
        }}
      />
    );
  }

  // If not logged in or worker_select screen active, render lightweight WorkerSelectionScreen
  if (!isLoggedIn || currentScreen === 'worker_select') {
    return (
      <WorkerSelectionScreen
        currentWorkerId={worker?.id}
        onSelectWorker={handleSelectWorker}
        onCancel={() => {
          if (isLoggedIn) {
            setCurrentScreen('dashboard');
          }
        }}
        canCancel={isLoggedIn && currentScreen === 'worker_select'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#14181F] flex flex-col md:pl-64 lg:pl-72 antialiased selection:bg-[#1F4D3D] selection:text-[#FFFFFF]">
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
        onSwitchWorker={handleOpenWorkerSelect}
      />

      {/* Main Container: Wide, intentional responsive layout for desktop with proper spacing */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-4 md:pt-6 pb-20 md:pb-12">
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

        {currentScreen === 'job_detail' && selectedJob && (
          <JobDetailScreen
            job={selectedJob}
            onBack={() => setCurrentScreen('dashboard')}
            onAccept={handleAcceptJob}
            onReject={handleRejectJob}
          />
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
            onSwitchWorker={handleOpenWorkerSelect}
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

      {/* Navigation: Mobile Bottom Nav + Desktop Persistent Left Sidebar */}
      <BottomNav
        currentScreen={currentScreen}
        hasActiveJob={!!activeSession}
        onSelectScreen={(screen) => {
          setCurrentScreen(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        worker={worker}
        isOnline={isOnline}
        onSwitchWorker={handleOpenWorkerSelect}
      />

      {/* Responsive Toast Notification */}
      {toastMessage && (
        <div 
          id="toast-banner"
          role="status"
          aria-live="polite"
          className="fixed top-20 md:top-6 right-4 md:right-8 z-50 bg-[#14181F] text-[#FFFFFF] px-4 py-3 md:px-5 md:py-3.5 rounded-[8px] md:rounded-[10px] text-[13px] md:text-[14px] font-[500] shadow-lg md:shadow-xl flex items-center gap-2.5 max-w-sm md:max-w-md border border-[#E7E5E1]/20 transition-all duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-[#A1D1BC] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
