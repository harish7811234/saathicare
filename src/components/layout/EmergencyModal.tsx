import React, { useState } from 'react';
import { X, PhoneCall, AlertTriangle, MapPin, ShieldAlert, CheckCircle2, User, Ambulance } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const { data, showToast } = useApp();
  const [alertSent, setAlertSent] = useState(false);
  const [callingNumber, setCallingNumber] = useState<string | null>(null);

  if (!isOpen) return null;

  const profile = data.profile;
  const emergencyContact = profile.emergencyContact;
  const physician = profile.primaryPhysician;

  const handleTriggerEmergency = () => {
    // Add high-priority escalation notification
    const alertNotif = {
      id: `alert-${Date.now()}`,
      title: '🚨 EMERGENCY SOS TRIGGERED',
      message: `${profile.name} triggered an Emergency SOS from ${profile.address}. Immediate attention required!`,
      category: 'system' as const,
      priority: 'escalation' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      targetRole: 'all' as const,
      isSimulated: true
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: profile.name,
      actorRole: 'elderly' as const,
      action: 'Emergency Assistance Triggered',
      details: `SOS alert dispatched to primary contacts (${emergencyContact.name}, ${physician.name}) and all Care Circle members.`,
      type: 'alert' as const
    };

    storageService.update((prev) => ({
      ...prev,
      notifications: [alertNotif, ...prev.notifications],
      activities: [newActivity, ...prev.activities],
    }));

    setAlertSent(true);
    showToast('🚨 Emergency SOS dispatched to Care Circle & Contacts!', 'alert');
  };

  const simulateCall = (name: string, phone: string) => {
    setCallingNumber(`${name} (${phone})`);
    showToast(`Connecting emergency call to ${name}...`, 'info');
    setTimeout(() => {
      setCallingNumber(null);
    }, 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergency-dialog-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-red-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <AlertTriangle className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h2 id="emergency-dialog-title" className="text-2xl font-bold tracking-tight">
                  Emergency Assistance
                </h2>
                <p className="text-sm text-red-100 font-medium">
                  Instant help & Care Circle notification
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close emergency modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Active Call Banner */}
          {callingNumber && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center space-x-3 text-amber-900 animate-pulse">
              <PhoneCall className="w-5 h-5 text-amber-700" />
              <div>
                <p className="text-sm font-semibold">Simulated Call In Progress</p>
                <p className="text-xs text-amber-700">Connecting to {callingNumber}...</p>
              </div>
            </div>
          )}

          {/* Alert Status Banner */}
          {alertSent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  Care Circle Alerted Successfully!
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  High-priority push notifications and timeline logs have been delivered to {emergencyContact.name} and the care team.
                </p>
              </div>
            </div>
          ) : (
            /* Big 1-Tap Trigger Button */
            <button
              onClick={handleTriggerEmergency}
              className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-bold text-lg rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center space-x-3 transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-400"
            >
              <ShieldAlert className="w-6 h-6" />
              <span>Broadcast SOS to Care Circle</span>
            </button>
          )}

          {/* Current Location */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Current Registered Location
                </p>
                <p className="text-sm font-medium text-stone-800 mt-0.5">
                  {profile.address}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Dial Contacts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Quick Dial Contacts
            </h3>
            <div className="space-y-2.5">
              {/* Primary Family Contact */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-red-50/50 rounded-2xl border border-stone-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {emergencyContact.name} ({emergencyContact.relation})
                    </p>
                    <p className="text-xs text-stone-600 font-mono">
                      {emergencyContact.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => simulateCall(emergencyContact.name, emergencyContact.phone)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
              </div>

              {/* Primary Doctor */}
              <div className="flex items-center justify-between p-3.5 bg-stone-50 hover:bg-red-50/50 rounded-2xl border border-stone-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                    ⚕️
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {physician.name} ({physician.specialty})
                    </p>
                    <p className="text-xs text-stone-600 font-mono">
                      {physician.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => simulateCall(physician.name, physician.phone)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
              </div>

              {/* Emergency Ambulance 108 */}
              <div className="flex items-center justify-between p-3.5 bg-red-50/60 rounded-2xl border border-red-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      National Ambulance & Medical SOS
                    </p>
                    <p className="text-xs text-red-700 font-mono font-bold">
                      Dial 108 / 112
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => simulateCall('Emergency Medical Services (108)', '108')}
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call 108</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
