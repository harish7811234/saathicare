import React from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  X,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useApp, AppPage } from '../../context/AppContext';
import { Role } from '../../types';

interface DemoStep {
  step: number;
  title: string;
  description: string;
  targetRole: Role;
  targetPage: AppPage;
  actionText: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: 'Welcome to SaathiCare',
    description: 'Explore the shared healthcare platform built for elderly independence and family peace of mind.',
    targetRole: 'elderly',
    targetPage: 'dashboard',
    actionText: 'Start Elderly Experience',
  },
  {
    step: 2,
    title: 'Enter as Elderly User (Meera)',
    description: 'Switch to Meera Patel (72). Notice the gentle colors, large readable typography, and reassuring copy.',
    targetRole: 'elderly',
    targetPage: 'dashboard',
    actionText: 'View Today’s Schedule',
  },
  {
    step: 3,
    title: 'View Today’s Medication Schedule',
    description: 'Notice the pastel color-coded dose cards categorized by Morning, Afternoon and Night.',
    targetRole: 'elderly',
    targetPage: 'medications',
    actionText: 'Go to Medications',
  },
  {
    step: 4,
    title: 'Confirm Medication Dose',
    description: 'Click "Mark as Taken" on an upcoming medicine. Watch the celebratory micro-interaction and state update.',
    targetRole: 'elderly',
    targetPage: 'dashboard',
    actionText: 'Ready to Confirm',
  },
  {
    step: 5,
    title: 'Switch to Family Member (Aarav)',
    description: 'Switch perspective to Aarav (Son). Aarav sees overall health status, pending tasks, and recent caretaker logs.',
    targetRole: 'family',
    targetPage: 'dashboard',
    actionText: 'Switch to Aarav (Family)',
  },
  {
    step: 6,
    title: 'View Updated Adherence Trends',
    description: 'Observe real-time adherence charts, weekly breakdown and consistency percentages derived from actual doses.',
    targetRole: 'family',
    targetPage: 'adherence',
    actionText: 'Inspect Adherence Chart',
  },
  {
    step: 7,
    title: 'Simulate Smart Missed-Dose Workflow',
    description: 'Click "Simulate Missed Dose" in the top bar. The system triggers immediate multi-tiered escalation.',
    targetRole: 'family',
    targetPage: 'notifications',
    actionText: 'Trigger Missed Dose Alert',
  },
  {
    step: 8,
    title: 'Show Caretaker (Priya) Notification',
    description: 'Switch to Priya Shah (Caretaker). Review the urgent alert for unconfirmed morning Metformin.',
    targetRole: 'caretaker',
    targetPage: 'notifications',
    actionText: 'Switch to Priya (Caretaker)',
  },
  {
    step: 9,
    title: 'Open Live Activity Timeline',
    description: 'Check the chronological activity stream logging every dose confirmation, alert, and role interaction.',
    targetRole: 'caretaker',
    targetPage: 'timeline',
    actionText: 'View Activity Timeline',
  },
  {
    step: 10,
    title: 'Review Doctor Appointments & Care Circle',
    description: 'Check Dr. Rajesh Sharma’s cardiology visit, instructions, and collaborative Care Circle members.',
    targetRole: 'family',
    targetPage: 'appointments',
    actionText: 'Inspect Appointments',
  },
];

export const GuidedDemoBar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    demoGuideStep,
    setDemoGuideStep,
    setRole,
    setActivePage,
    simulateMissedDose,
    resetDemoData,
  } = useApp();

  const currentStep = DEMO_STEPS.find((s) => s.step === demoGuideStep) || DEMO_STEPS[0];

  const handleStepAction = () => {
    // Apply step configuration
    setRole(currentStep.targetRole);
    setActivePage(currentStep.targetPage);

    if (currentStep.step === 7) {
      simulateMissedDose();
    }

    if (demoGuideStep < DEMO_STEPS.length) {
      setDemoGuideStep(demoGuideStep + 1);
    }
  };

  return (
    <div className="bg-[#FAF8F2] border-b border-[#EAE9E2] px-4 py-2.5 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Step Indicator & Info */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-7 h-7 rounded-lg bg-[#E6F1E8] border border-[#789B7D]/30 flex items-center justify-center text-[#587A5D] font-bold text-xs flex-shrink-0">
            {currentStep.step} / {DEMO_STEPS.length}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#30352F] tracking-tight">
                {currentStep.title}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#EAE9E2] text-[#77786F]">
                Target: {currentStep.targetRole.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-[#77786F] line-clamp-1">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-shrink-0">
          {demoGuideStep > 1 && (
            <button
              onClick={() => {
                const prev = demoGuideStep - 1;
                setDemoGuideStep(prev);
                const s = DEMO_STEPS[prev - 1];
                setRole(s.targetRole);
                setActivePage(s.targetPage);
              }}
              className="px-2.5 py-1 text-xs font-medium text-[#77786F] hover:text-[#30352F] rounded-lg transition-colors"
            >
              Back
            </button>
          )}

          <button
            onClick={handleStepAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
          >
            <span>{currentStep.actionText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset demo path to step 1 and restore initial data?')) {
                resetDemoData();
              }
            }}
            className="p-1.5 text-[#77786F] hover:text-[#30352F] rounded-lg"
            title="Reset to step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-[#77786F] hover:text-[#30352F] rounded-lg"
            title="Close tour bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
