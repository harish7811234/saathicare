import React from 'react';
import {
  Menu,
  Bell,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  UserCheck,
  Compass,
} from 'lucide-react';
import { useApp, AppPage, DEMO_USERS } from '../../context/AppContext';
import { Role } from '../../types';

export const Topbar: React.FC<{
  onOpenSidebar: () => void;
  showGuidedDemo: boolean;
  setShowGuidedDemo: (val: boolean) => void;
}> = ({ onOpenSidebar, showGuidedDemo, setShowGuidedDemo }) => {
  const {
    role,
    setRole,
    currentUser,
    activePage,
    setActivePage,
    unreadCount,
    simulateMissedDose,
    isSimulating,
    resetDemoData,
  } = useApp();

  const roleConfigs: Array<{
    id: Role;
    label: string;
    sublabel: string;
    avatar: string;
    badgeColor: string;
  }> = [
    {
      id: 'elderly',
      label: 'Meera (Elderly)',
      sublabel: 'Self View',
      avatar: '👵',
      badgeColor: 'bg-[#E6F1E8] text-[#587A5D]',
    },
    {
      id: 'family',
      label: 'Aarav (Family)',
      sublabel: 'Son & Guardian',
      avatar: '👨‍💼',
      badgeColor: 'bg-[#FCE8D8] text-[#B86234]',
    },
    {
      id: 'caretaker',
      label: 'Priya (Caretaker)',
      sublabel: 'Daily Assistant',
      avatar: '👩‍⚕️',
      badgeColor: 'bg-[#E8EAF7] text-[#505A8D]',
    },
  ];

  const getPageTitle = (page: AppPage): { title: string; subtitle: string } => {
    switch (page) {
      case 'dashboard':
        return {
          title: role === 'elderly' ? 'Daily Healthcare Routine' : "Meera's Care Dashboard",
          subtitle: role === 'elderly' ? 'Good morning, Meera. Here is your plan for today.' : 'Collaborative care overview and real-time status.',
        };
      case 'medications':
        return {
          title: 'Medication Management',
          subtitle: 'Active prescriptions, timing schedules and dose history.',
        };
      case 'adherence':
        return {
          title: 'Medication Adherence',
          subtitle: 'Consistency trends, weekly compliance, and timing insights.',
        };
      case 'appointments':
        return {
          title: 'Doctor Appointments',
          subtitle: 'Scheduled hospital visits, clinic consultations, and follow-ups.',
        };
      case 'care-circle':
        return {
          title: 'Care Circle',
          subtitle: 'Connected family members, professional caretakers, and doctors.',
        };
      case 'profile':
        return {
          title: 'Elderly Health Profile',
          subtitle: 'Medical conditions, vital signs, allergies, and emergency info.',
        };
      case 'notifications':
        return {
          title: 'Notification Centre',
          subtitle: 'Real-time alerts, dose reminders, and care escalation feed.',
        };
      case 'timeline':
        return {
          title: 'Healthcare Timeline',
          subtitle: 'Chronological activity stream of all care events and confirmations.',
        };
      case 'settings':
        return {
          title: 'Demo Settings & Preferences',
          subtitle: 'Configure alert simulations, accessibility, and demo data state.',
        };
      default:
        return { title: 'SaathiCare', subtitle: 'Care That Connects Generations' };
    }
  };

  const { title, subtitle } = getPageTitle(activePage);

  return (
    <header className="sticky top-0 z-20 bg-[#FAF8F2]/90 backdrop-blur-md border-b border-[#EAE9E2] px-3 sm:px-6 py-2.5 sm:py-3.5 transition-all">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Mobile hamburger + Page Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-[#77786F] hover:bg-[#EAE9E2]/60 transition-colors flex-shrink-0"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:block truncate">
            <h1 className="text-lg font-semibold tracking-tight text-[#30352F] leading-snug truncate">
              {title}
            </h1>
            <p className="text-xs text-[#77786F] truncate">{subtitle}</p>
          </div>
        </div>

        {/* Center / Right: Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Guided Demo Button */}
          <button
            onClick={() => setShowGuidedDemo(!showGuidedDemo)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showGuidedDemo
                ? 'bg-[#789B7D] text-white border-[#789B7D] shadow-xs'
                : 'bg-white text-[#30352F] border-[#EAE9E2] hover:bg-[#FAF8F2]'
            }`}
            title="Toggle guided demo walkthrough"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Demo Tour</span>
          </button>

          {/* SIMULATE MISSED DOSE BUTTON - Very prominent for hackathon */}
          <button
            onClick={simulateMissedDose}
            disabled={isSimulating}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold border shadow-xs transition-all ${
              isSimulating
                ? 'bg-[#FAD8D8] text-[#D95C5C] border-[#FAD8D8] animate-pulse'
                : 'bg-white text-[#B86234] border-[#FCE8D8] hover:bg-[#FCE8D8]/50 active:scale-95'
            }`}
            title="Instantly simulates an unconfirmed 9:00 AM dose and triggers full escalation to Caretaker & Family"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#B86234]" />
            <span className="font-medium">
              <span className="hidden sm:inline">Simulate </span>Missed Dose
            </span>
          </button>

          {/* Role Selector Pill */}
          <div className="hidden sm:flex items-center bg-white p-1 rounded-xl border border-[#EAE9E2] shadow-xs">
            {roleConfigs.map((cfg) => {
              const isSelected = role === cfg.id;
              return (
                <button
                  key={cfg.id}
                  onClick={() => setRole(cfg.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-[#E6F1E8] text-[#30352F] font-semibold shadow-xs'
                      : 'text-[#77786F] hover:text-[#30352F] hover:bg-[#FAF8F2]'
                  }`}
                >
                  <span className="text-sm">{cfg.avatar}</span>
                  <span className="capitalize">{cfg.id}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Role Switcher (Compact Dropdown) */}
          <div className="sm:hidden">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              aria-label="Select demo role"
              className="bg-white border border-[#EAE9E2] text-xs font-semibold text-[#30352F] rounded-xl px-2 py-1.5 shadow-xs focus:outline-none"
            >
              <option value="elderly">👵 Meera</option>
              <option value="family">👨‍💼 Aarav</option>
              <option value="caretaker">👩‍⚕️ Priya</option>
            </select>
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => setActivePage('notifications')}
            className="relative p-2 rounded-xl bg-white border border-[#EAE9E2] text-[#77786F] hover:text-[#30352F] hover:bg-[#FAF8F2] shadow-xs transition-colors"
            title="Notification Centre"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E09B75] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Reset Demo Quick Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to clean initial state?')) {
                resetDemoData();
              }
            }}
            className="hidden xl:flex items-center gap-1 p-2 rounded-xl bg-white border border-[#EAE9E2] text-[#77786F] hover:text-[#30352F] hover:bg-[#FAF8F2] shadow-xs text-xs font-medium transition-colors"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
