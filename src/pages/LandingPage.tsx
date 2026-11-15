import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Pill,
  Users2,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

export const LandingPage: React.FC = () => {
  const { setActivePage, setRole } = useApp();

  const handleLaunchRole = (role: Role) => {
    setRole(role);
    setActivePage('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-[#30352F] selection:bg-[#E6F1E8]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#FAF8F2]/90 backdrop-blur-md border-b border-[#EAE9E2] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#789B7D] flex items-center justify-center text-white font-semibold text-lg shadow-soft">
              <Sparkles className="w-5 h-5 text-[#FAF8F2]" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#30352F]">SaathiCare</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-[#77786F] font-medium border-l border-[#EAE9E2] pl-2">
                Care That Connects Generations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('roles-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#77786F] hover:text-[#30352F] px-3 py-2 rounded-xl transition-colors hidden sm:inline-block"
            >
              Demo Roles
            </button>
            <button
              onClick={() => handleLaunchRole('elderly')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
            >
              <span>Launch Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F1E8] border border-[#789B7D]/30 text-xs font-semibold text-[#587A5D]">
            <span>🌱</span>
            <span>A collaborative elderly healthcare management platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#30352F] leading-[1.15]">
            Better care begins with staying connected.
          </h1>

          <p className="text-base sm:text-lg text-[#77786F] leading-relaxed max-w-2xl mx-auto">
            One shared healthcare space for elderly individuals, families, and caretakers.
            Manage medications, appointments, and everyday routines together with warmth and dignity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleLaunchRole('elderly')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-sm font-semibold shadow-card transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Enter Demo Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-[#EAE9E2] text-[#30352F] hover:bg-[#FAF8F2] text-sm font-semibold shadow-soft transition-colors"
            >
              <span>Explore Features</span>
            </button>
          </div>

          {/* Quick interactive role badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-medium text-[#77786F]">Quick Demo Persona Access:</span>
            <button
              onClick={() => handleLaunchRole('elderly')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE9E2] text-xs font-semibold text-[#30352F] hover:border-[#789B7D] hover:bg-[#E6F1E8]/50 transition-colors shadow-xs"
            >
              👵 Meera Patel (Elderly)
            </button>
            <button
              onClick={() => handleLaunchRole('family')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE9E2] text-xs font-semibold text-[#30352F] hover:border-[#E09B75] hover:bg-[#FCE8D8]/50 transition-colors shadow-xs"
            >
              👨‍💼 Aarav Patel (Family)
            </button>
            <button
              onClick={() => handleLaunchRole('caretaker')}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#EAE9E2] text-xs font-semibold text-[#30352F] hover:border-[#7A83B8] hover:bg-[#E8EAF7]/50 transition-colors shadow-xs"
            >
              👩‍⚕️ Priya Shah (Caretaker)
            </button>
          </div>
        </div>

        {/* Hero Visual Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-white border border-[#EAE9E2] shadow-elevated p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1: Elderly */}
            <div className="p-5 rounded-2xl bg-[#E6F1E8]/50 border border-[#789B7D]/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6F1E8] text-2xl flex items-center justify-center">
                👵
              </div>
              <h3 className="text-base font-bold text-[#30352F]">Independence First</h3>
              <p className="text-xs text-[#77786F] leading-relaxed">
                Large buttons, high-contrast text, and gentle morning reminders designed specifically for elderly comfort.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#587A5D]">
                <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Dose Confirmations
              </div>
            </div>

            {/* Pillar 2: Family */}
            <div className="p-5 rounded-2xl bg-[#FCE8D8]/50 border border-[#E09B75]/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FCE8D8] text-2xl flex items-center justify-center">
                👨‍💼
              </div>
              <h3 className="text-base font-bold text-[#30352F]">Family Peace of Mind</h3>
              <p className="text-xs text-[#77786F] leading-relaxed">
                Stay updated from anywhere. View medication adherence charts, doctor visits, and caretaker logs in real time.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#B86234]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Smart Escalations on Missed Doses
              </div>
            </div>

            {/* Pillar 3: Caretaker */}
            <div className="p-5 rounded-2xl bg-[#E8EAF7]/50 border border-[#7A83B8]/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E8EAF7] text-2xl flex items-center justify-center">
                👩‍⚕️
              </div>
              <h3 className="text-base font-bold text-[#30352F]">Seamless Caregiving</h3>
              <p className="text-xs text-[#77786F] leading-relaxed">
                Coordinated schedules, instant notifications, vitals logging, and clear daily responsibilities.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#505A8D]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Shared Healthcare Feed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem & Vision Section */}
      <section className="py-16 px-6 bg-[#FFFFFF] border-y border-[#EAE9E2]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#789B7D]">The Problem We Solve</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#30352F] tracking-tight">
              Elderly care is fragmented across messaging apps and scattered notes.
            </h2>
            <p className="text-sm text-[#77786F]">
              Families worry silently, elderly individuals feel micromanaged, and caretakers lack structured logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] space-y-4">
              <h4 className="text-base font-bold text-[#D95C5C] flex items-center gap-2">
                <span>⚠️</span> Traditional Fragmented Care
              </h4>
              <ul className="space-y-2 text-xs text-[#77786F]">
                <li className="flex items-center gap-2">❌ Repetitive phone calls asking "Did you take your pill?"</li>
                <li className="flex items-center gap-2">❌ Missed doses discovered hours or days later</li>
                <li className="flex items-center gap-2">❌ Doctor appointment prescriptions lost in paper files</li>
                <li className="flex items-center gap-2">❌ High anxiety for distant family members</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-[#E6F1E8]/40 border border-[#789B7D]/30 space-y-4">
              <h4 className="text-base font-bold text-[#587A5D] flex items-center gap-2">
                <span>🌿</span> The SaathiCare Way
              </h4>
              <ul className="space-y-2 text-xs text-[#30352F]">
                <li className="flex items-center gap-2">✓ Dignified 1-tap confirmation preserves elder independence</li>
                <li className="flex items-center gap-2">✓ Smart automated escalations only alert family when needed</li>
                <li className="flex items-center gap-2">✓ Centralized medical schedule, doctor visits, and vitals</li>
                <li className="flex items-center gap-2">✓ Synchronized Care Circle of family, nurses, and doctors</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#789B7D]">Core Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#30352F] tracking-tight">
            How SaathiCare Connects Generations
          </h2>
          <p className="text-sm text-[#77786F]">
            Thoughtfully built for high usability, gentle aesthetics, and zero tech frustration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="saathi-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E6F1E8] text-[#587A5D] flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#30352F]">Medication Routine</h4>
            <p className="text-xs text-[#77786F] leading-relaxed">
              Pastel color-coded doses organized by morning, afternoon, and evening. Easily marked taken with celebratory feedback.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="saathi-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FCE8D8] text-[#B86234] flex items-center justify-center font-bold">
              <BellRing className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#30352F]">Smart Missed-Dose Alerts</h4>
            <p className="text-xs text-[#77786F] leading-relaxed">
              If an important medication is unconfirmed within its reminder window, SaathiCare alerts the caretaker and escalates to family.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="saathi-card p-6 bg-white space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8EAF7] text-[#505A8D] flex items-center justify-center font-bold">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#30352F]">Appointment Management</h4>
            <p className="text-xs text-[#77786F] leading-relaxed">
              Track upcoming cardiologist, eye, and orthopedic visits. Assign who accompanies the elderly parent to each visit.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Roles Section */}
      <section id="roles-section" className="py-16 px-6 bg-[#FFFFFF] border-t border-[#EAE9E2]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#789B7D]">Interactive Demo Roles</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#30352F] tracking-tight">
              Experience the App From 3 Unique Perspectives
            </h2>
            <p className="text-sm text-[#77786F]">
              Click any profile below to immediately launch that tailored role experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Meera */}
            <div
              onClick={() => handleLaunchRole('elderly')}
              className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] hover:border-[#789B7D] hover:shadow-card cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">👵</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F1E8] text-[#587A5D]">
                  Elderly Mode
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#30352F] group-hover:text-[#587A5D] transition-colors">
                  Meera Patel, 72
                </h4>
                <p className="text-xs text-[#77786F]">Care Recipient (Mother)</p>
              </div>
              <p className="text-xs text-[#77786F] leading-relaxed">
                Large high-contrast touch targets, today’s routine, 1-click dose confirmation, and simple view of doctors.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#587A5D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Enter as Meera</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Aarav */}
            <div
              onClick={() => handleLaunchRole('family')}
              className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] hover:border-[#E09B75] hover:shadow-card cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">👨‍💼</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCE8D8] text-[#B86234]">
                  Family Member
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#30352F] group-hover:text-[#B86234] transition-colors">
                  Aarav Patel
                </h4>
                <p className="text-xs text-[#77786F]">Son & Primary Guardian</p>
              </div>
              <p className="text-xs text-[#77786F] leading-relaxed">
                Add and manage prescriptions, inspect weekly adherence trends, receive escalation alerts, and schedule appointments.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#B86234] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Enter as Aarav</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Priya */}
            <div
              onClick={() => handleLaunchRole('caretaker')}
              className="p-6 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] hover:border-[#7A83B8] hover:shadow-card cursor-pointer transition-all space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-4xl">👩‍⚕️</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8EAF7] text-[#505A8D]">
                  Caretaker
                </span>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#30352F] group-hover:text-[#505A8D] transition-colors">
                  Priya Shah
                </h4>
                <p className="text-xs text-[#77786F]">Certified Geriatric Caretaker</p>
              </div>
              <p className="text-xs text-[#77786F] leading-relaxed">
                Confirm dose administration, record daily vitals, view pending medication tasks, and coordinate with family.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#505A8D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Enter as Priya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#EAE9E2] bg-[#FAF8F2]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77786F]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#30352F]">SaathiCare</span>
            <span>• Care That Connects Generations</span>
          </div>
          <p>© 2026 SaathiCare Hackathon MVP. LocalStorage persistance layer.</p>
        </div>
      </footer>
    </div>
  );
};
