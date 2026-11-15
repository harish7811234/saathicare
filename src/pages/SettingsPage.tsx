import React, { useState } from 'react';
import {
  RotateCcw,
  Sliders,
  Database,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';

export const SettingsPage: React.FC = () => {
  const { data, resetDemoData, showToast } = useApp();

  const [escalationMins, setEscalationMins] = useState(
    data.settings?.missedDoseEscalationMinutes || 15
  );
  const [largeText, setLargeText] = useState(
    data.settings?.largeTextElderlyMode ?? true
  );
  const [soundEnabled, setSoundEnabled] = useState(
    data.settings?.audioChimesEnabled ?? true
  );

  const handleSaveSettings = () => {
    storageService.update((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        missedDoseEscalationMinutes: Number(escalationMins),
        largeTextElderlyMode: largeText,
        audioChimesEnabled: soundEnabled,
      },
    }));
    showToast('Preferences saved successfully.', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Settings Card */}
      <div className="saathi-card p-6 sm:p-7 bg-white space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#30352F] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#789B7D]" />
            <span>Care Configuration & Accessibility</span>
          </h2>
          <p className="text-xs text-[#77786F] mt-1">
            Configure automated escalation parameters and elderly-friendly accessibility preferences.
          </p>
        </div>

        <div className="divide-y divide-[#EAE9E2] space-y-4">
          {/* Setting 1: Escalation Interval */}
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-sm font-semibold text-[#30352F] block">
                Missed Dose Escalation Window
              </span>
              <span className="text-xs text-[#77786F]">
                Minutes after scheduled dose before automatic alerts are dispatched to Caretaker and Family.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={5}
                max={60}
                value={escalationMins}
                onChange={(e) => setEscalationMins(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-xl border border-[#EAE9E2] text-xs font-bold text-[#30352F] text-center"
              />
              <span className="text-xs text-[#77786F]">minutes</span>
            </div>
          </div>

          {/* Setting 2: Large Text Mode */}
          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-[#30352F] block">
                Large Text & High Touch Targets in Elderly Mode
              </span>
              <span className="text-xs text-[#77786F]">
                Increases button sizes, font sizes, and contrast when viewing as Meera.
              </span>
            </div>
            <button
              onClick={() => setLargeText(!largeText)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                largeText ? 'bg-[#789B7D]' : 'bg-[#EAE9E2]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                  largeText ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* Setting 3: Audio Chimes */}
          <div className="pt-4 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-[#30352F] block">
                Gentle Audio Reminders & Confetti
              </span>
              <span className="text-xs text-[#77786F]">
                Plays micro-animations upon confirming daily medications.
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-[#789B7D]' : 'bg-[#EAE9E2]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs absolute top-0.5 transition-transform ${
                  soundEnabled ? 'right-0.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
          >
            Save Preferences
          </button>
        </div>
      </div>

      {/* Storage & Persistence Details */}
      <div className="saathi-card p-6 bg-white space-y-4">
        <h3 className="text-base font-bold text-[#30352F] tracking-tight flex items-center gap-2">
          <Database className="w-4 h-4 text-[#789B7D]" />
          <span>Storage Abstraction & Hackathon Persistence</span>
        </h3>

        <p className="text-xs text-[#77786F] leading-relaxed">
          SaathiCare utilizes a decoupled storage abstraction layer with typed repositories.
          All application state is stored locally under a versioned schema key (<code className="font-bold text-[#30352F]">saathicare_app_data_v1</code>)
          and survives browser refreshes without requiring external database latency.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2]">
            <span className="text-[10px] text-[#77786F] uppercase tracking-wider block">Schema Version</span>
            <span className="font-bold text-[#30352F] text-sm">v1.0 (Typed)</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2]">
            <span className="text-[10px] text-[#77786F] uppercase tracking-wider block">Active Medications</span>
            <span className="font-bold text-[#30352F] text-sm">{data.medications?.length || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2]">
            <span className="text-[10px] text-[#77786F] uppercase tracking-wider block">Appointments</span>
            <span className="font-bold text-[#30352F] text-sm">{data.appointments?.length || 0}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2]">
            <span className="text-[10px] text-[#77786F] uppercase tracking-wider block">Activity Logs</span>
            <span className="font-bold text-[#30352F] text-sm">{data.activities?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="saathi-card p-6 bg-[#FFF8F8] border border-[#FAD8D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#D95C5C] flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </h4>
          <p className="text-xs text-[#77786F] mt-1">
            Restores all medications, appointments, and adherence history to initial pristine demo state.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo data back to clean initial state?')) {
              resetDemoData();
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-[#D95C5C] hover:bg-[#B84040] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          Reset All Demo Data
        </button>
      </div>
    </div>
  );
};
