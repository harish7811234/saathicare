/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Role, User, StorageData } from '../types';
import { DEMO_USERS } from '../data/demoUsers';
export { DEMO_USERS };
import { storageService } from '../services/storageService';
import { medicationService } from '../services/medicationService';
import { notificationService } from '../services/notificationService';
import confetti from 'canvas-confetti';

export type AppPage =
  | 'landing'
  | 'dashboard'
  | 'medications'
  | 'adherence'
  | 'appointments'
  | 'care-circle'
  | 'profile'
  | 'notifications'
  | 'timeline'
  | 'settings';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: User;
  data: StorageData;
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  confirmDose: (doseId: string, action: 'taken' | 'skipped' | 'upcoming') => void;
  simulateMissedDose: () => void;
  resetDemoData: () => void;
  unreadCount: number;
  demoGuideStep: number;
  setDemoGuideStep: (step: number) => void;
  isSimulating: boolean;
  toast: { message: string; type: 'success' | 'alert' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'alert' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem('saathicare_current_role');
      return (saved === 'elderly' || saved === 'family' || saved === 'caretaker') ? saved : 'elderly';
    } catch {
      return 'elderly';
    }
  });

  const [activePage, setActivePageState] = useState<AppPage>(() => {
    try {
      const saved = localStorage.getItem('saathicare_active_page');
      return (saved as AppPage) || 'landing';
    } catch {
      return 'landing';
    }
  });

  const [data, setData] = useState<StorageData>(() => storageService.get());
  const [demoGuideStep, setDemoGuideStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = storageService.subscribe((updated) => {
      setData({ ...updated });
    });
    return unsubscribe;
  }, []);

  const currentUser = DEMO_USERS[role];
  const unreadCount = data.notifications?.filter((n) => !n.read).length || 0;

  const showToast = (message: string, type: 'success' | 'alert' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const setActivePage = (page: AppPage) => {
    setActivePageState(page);
    try {
      localStorage.setItem('saathicare_active_page', page);
    } catch {}
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('saathicare_current_role', newRole);
    } catch {}
    showToast(`Switched view to ${DEMO_USERS[newRole].name} (${newRole.toUpperCase()})`, 'info');
  };

  const confirmDose = (doseId: string, action: 'taken' | 'skipped' | 'upcoming') => {
    const updated = medicationService.confirmDose(doseId, action, currentUser.name, currentUser.role);
    if (action === 'taken') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#789B7D', '#E6F1E8', '#FCE8D8', '#F5E9B9'],
        });
      } catch {
        // ignore confetti errors in unsupported environments
      }
      showToast(`Great job! Marked ${updated?.medicationName || 'dose'} as taken.`, 'success');
    } else if (action === 'skipped') {
      showToast(`Marked ${updated?.medicationName || 'dose'} as skipped.`, 'alert');
    } else {
      showToast(`Reset ${updated?.medicationName || 'dose'} to scheduled.`, 'info');
    }
  };

  const simulateMissedDose = () => {
    setIsSimulating(true);
    showToast('Simulating unconfirmed morning dose...', 'info');

    setTimeout(() => {
      notificationService.simulateMissedDose('Metformin XR (500 mg)', '09:00 AM');
      setIsSimulating(false);
      showToast('⚠️ Missed dose escalation triggered! Caretaker & Family alerted.', 'alert');
    }, 700);
  };

  const resetDemoData = () => {
    const fresh = storageService.reset();
    setData(fresh);
    setRoleState('elderly');
    setActivePageState('dashboard');
    try {
      localStorage.setItem('saathicare_current_role', 'elderly');
      localStorage.setItem('saathicare_active_page', 'dashboard');
    } catch {}
    setDemoGuideStep(1);
    showToast('Demo data reset to clean initial state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        data,
        activePage,
        setActivePage,
        confirmDose,
        simulateMissedDose,
        resetDemoData,
        unreadCount,
        demoGuideStep,
        setDemoGuideStep,
        isSimulating,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
