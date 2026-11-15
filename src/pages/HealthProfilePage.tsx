import React, { useState } from 'react';
import {
  Activity,
  Phone,
  MapPin,
  Edit2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';

export const HealthProfilePage: React.FC = () => {
  const { role, currentUser, data, showToast } = useApp();
  const profile = data.profile;

  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [bp, setBp] = useState(profile.vitals.bloodPressure);
  const [sugar, setSugar] = useState(profile.vitals.bloodSugar);
  const [pulse, setPulse] = useState(profile.vitals.pulse);
  const [weight, setWeight] = useState(profile.vitals.weight);

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    profileService.updateVitals(
      {
        bloodPressure: bp.trim(),
        bloodSugar: sugar.trim(),
        pulse: pulse.trim(),
        weight: weight.trim(),
        lastUpdated: 'Just now',
      },
      currentUser.name,
      currentUser.role
    );
    setIsEditingVitals(false);
    showToast('Updated daily vitals record.', 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="saathi-card p-6 sm:p-8 bg-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-[#FAF8F2] border border-[#EAE9E2] flex items-center justify-center text-5xl shadow-soft">
              {profile.avatar}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight text-[#30352F]">
                  {profile.name}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#E6F1E8] text-[#587A5D]">
                  Age {profile.age}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF8F2] border border-[#EAE9E2] text-[#77786F]">
                  Blood: {profile.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-[#77786F] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#789B7D]" />
                <span>{profile.address}</span>
              </p>
              <p className="text-xs text-[#77786F]">
                Preferred Language: <span className="font-medium text-[#30352F]">{profile.preferredLanguage}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Section (Apple Health Influence) */}
      <div className="saathi-card p-6 bg-white space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#30352F] tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#789B7D]" />
              <span>Current Vital Signs</span>
            </h3>
            <p className="text-xs text-[#77786F]">
              Last recorded: {profile.vitals.lastUpdated}
            </p>
          </div>

          {role !== 'elderly' && (
            <button
              onClick={() => setIsEditingVitals(!isEditingVitals)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] text-xs font-semibold text-[#30352F] hover:bg-[#EAE9E2]/50 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingVitals ? 'Cancel' : 'Update Vitals'}</span>
            </button>
          )}
        </div>

        {isEditingVitals ? (
          <form onSubmit={handleSaveVitals} className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#30352F] mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  placeholder="e.g. 124/82 mmHg"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE9E2] text-xs bg-white text-[#30352F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#30352F] mb-1">Blood Sugar</label>
                <input
                  type="text"
                  value={sugar}
                  onChange={(e) => setSugar(e.target.value)}
                  placeholder="e.g. 118 mg/dL"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE9E2] text-xs bg-white text-[#30352F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#30352F] mb-1">Pulse Rate</label>
                <input
                  type="text"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  placeholder="e.g. 74 bpm"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE9E2] text-xs bg-white text-[#30352F]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#30352F] mb-1">Body Weight</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 62.4 kg"
                  className="w-full px-3 py-1.5 rounded-xl border border-[#EAE9E2] text-xs bg-white text-[#30352F]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#789B7D] text-white text-xs font-semibold shadow-xs hover:bg-[#698B6E]"
              >
                Save New Vitals
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#E6F1E8]/40 border border-[#789B7D]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#587A5D]">
                Blood Pressure
              </span>
              <p className="text-xl font-extrabold text-[#30352F]">{profile.vitals.bloodPressure}</p>
              <span className="text-[10px] text-[#587A5D]">Normal Stage 1 control</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FCE8D8]/40 border border-[#E09B75]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B86234]">
                Fasting Sugar
              </span>
              <p className="text-xl font-extrabold text-[#30352F]">{profile.vitals.bloodSugar}</p>
              <span className="text-[10px] text-[#B86234]">Within target range</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8EAF7]/40 border border-[#7A83B8]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#505A8D]">
                Pulse
              </span>
              <p className="text-xl font-extrabold text-[#30352F]">{profile.vitals.pulse}</p>
              <span className="text-[10px] text-[#505A8D]">Resting sinus rhythm</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5E9B9]/40 border border-[#C8A336]/20 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6B15]">
                Weight
              </span>
              <p className="text-xl font-extrabold text-[#30352F]">{profile.vitals.weight}</p>
              <span className="text-[10px] text-[#8B6B15]">Stable over 90 days</span>
            </div>
          </div>
        )}
      </div>

      {/* Conditions, Allergies & Emergency Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Clinical Conditions & Allergies */}
        <div className="saathi-card p-6 bg-white space-y-4">
          <h3 className="text-base font-bold text-[#30352F] tracking-tight">
            Diagnosed Conditions & Allergies
          </h3>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-semibold text-[#77786F] block mb-1.5">
                Chronic Conditions:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.conditions.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-[#FAF8F2] border border-[#EAE9E2] text-[#30352F]"
                  >
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-[#D95C5C] block mb-1.5">
                Known Drug Allergies:
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((a, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#FFF0F0] border border-[#FAD8D8] text-[#D95C5C]"
                  >
                    ⚠️ {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts & Physician */}
        <div className="saathi-card p-6 bg-white space-y-4">
          <h3 className="text-base font-bold text-[#30352F] tracking-tight">
            Key Care Contacts
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#789B7D]">
                Primary Emergency Contact
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#30352F]">
                    {profile.emergencyContact.name} ({profile.emergencyContact.relation})
                  </h4>
                  <a
                    href={`tel:${profile.emergencyContact.phone}`}
                    className="text-xs text-[#77786F] hover:text-[#30352F] flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3 text-[#789B7D]" />
                    <span>{profile.emergencyContact.phone}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B86234]">
                Attending Primary Physician
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#30352F]">
                    {profile.primaryPhysician.name}
                  </h4>
                  <p className="text-xs text-[#77786F]">
                    {profile.primaryPhysician.specialty} • {profile.primaryPhysician.clinic}
                  </p>
                  <a
                    href={`tel:${profile.primaryPhysician.phone}`}
                    className="text-xs text-[#77786F] hover:text-[#30352F] flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3 text-[#789B7D]" />
                    <span>{profile.primaryPhysician.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
