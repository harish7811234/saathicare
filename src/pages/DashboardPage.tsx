import React, { useState } from 'react';
import {
  Heart,
  Pill,
  CalendarDays,
  LineChart as ChartIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Plus,
  Bell,
  Activity,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { medicationService } from '../services/medicationService';
import { appointmentService } from '../services/appointmentService';
import { MedicationDoseCard } from '../components/medications/MedicationDoseCard';
import { AddMedicationModal } from '../components/medications/AddMedicationModal';
import { AddAppointmentModal } from '../components/appointments/AddAppointmentModal';

export const DashboardPage: React.FC = () => {
  const { role, currentUser, data, setActivePage } = useApp();
  const [showAddMedModal, setShowAddMedModal] = useState(false);
  const [showAddAptModal, setShowAddAptModal] = useState(false);

  // Derived real metrics
  const metrics = medicationService.getAdherenceMetrics();
  const todayDoses = medicationService.getTodayDoses();
  const upcomingAppointments = appointmentService.getUpcoming().slice(0, 2);
  const recentActivities = (data.activities || []).slice(0, 4);

  const isElderly = role === 'elderly';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="saathi-card p-6 sm:p-7 bg-white relative overflow-hidden">
        {/* Soft decorative background shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E6F1E8]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-40 w-60 h-60 bg-[#FCE8D8]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F1E8] text-[#587A5D] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isElderly
                  ? 'Your morning healthcare routine is active'
                  : `Viewing as ${currentUser.name} (${role.toUpperCase()})`}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#30352F]">
              {isElderly
                ? 'Good morning, Meera!'
                : `Collaborative Care for Meera Patel`}
            </h2>

            <p className="text-sm text-[#77786F] max-w-xl leading-relaxed">
              {isElderly
                ? `You have taken ${metrics.todayProgress.taken} of ${metrics.todayProgress.total} medicines scheduled for today. Take your time and stay hydrated.`
                : `Meera is currently at ${metrics.todayProgress.percentage}% daily routine completion. ${metrics.todayProgress.pending} doses remaining.`}
            </p>
          </div>

          {/* Quick Elderly Profile Summary Card */}
          <div className="flex-shrink-0 p-4 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] flex items-center gap-4">
            <span className="text-4xl">👵</span>
            <div className="space-y-0.5">
              <span className="text-sm font-bold text-[#30352F] block">
                {data.profile.name}
              </span>
              <span className="text-xs text-[#77786F] block">
                Age: {data.profile.age} • Blood: {data.profile.bloodGroup}
              </span>
              <div className="pt-1 flex items-center gap-2 text-[11px] font-semibold text-[#587A5D]">
                <span className="w-2 h-2 rounded-full bg-[#789B7D] inline-block" />
                <span>BP: {data.profile.vitals.bloodPressure}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Quick Metric Cards (Apple Health Influence) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Today Progress */}
        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-2 font-medium">
            <span>Today's Routine</span>
            <div className="w-7 h-7 rounded-lg bg-[#E6F1E8] text-[#587A5D] flex items-center justify-center font-bold">
              <Pill className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#30352F] tracking-tight mb-1">
            {metrics.todayProgress.taken} / {metrics.todayProgress.total}
          </div>
          <div className="w-full bg-[#EAE9E2] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#789B7D] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${metrics.todayProgress.percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-[#77786F] mt-2 font-medium">
            {metrics.todayProgress.percentage}% completed today
          </p>
        </div>

        {/* Metric 2: 7-Day Adherence */}
        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-2 font-medium">
            <span>Weekly Adherence</span>
            <div className="w-7 h-7 rounded-lg bg-[#FCE8D8] text-[#B86234] flex items-center justify-center font-bold">
              <ChartIcon className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#30352F] tracking-tight mb-1">
            {metrics.overallRate}%
          </div>
          <p className="text-[11px] text-[#587A5D] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Excellent consistency
          </p>
          <p className="text-[10px] text-[#77786F] mt-1">Based on past 7 days logs</p>
        </div>

        {/* Metric 3: Next Reminder */}
        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-2 font-medium">
            <span>Next Medicine</span>
            <div className="w-7 h-7 rounded-lg bg-[#E8EAF7] text-[#505A8D] flex items-center justify-center font-bold">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base font-bold text-[#30352F] truncate mb-0.5">
            {metrics.nextReminder ? metrics.nextReminder.medicationName : 'All done!'}
          </div>
          <p className="text-xs font-semibold text-[#789B7D]">
            {metrics.nextReminder ? metrics.nextReminder.scheduledTime : 'Great job today'}
          </p>
          <p className="text-[10px] text-[#77786F] truncate mt-1">
            {metrics.nextReminder ? metrics.nextReminder.dosage : 'No more pending doses'}
          </p>
        </div>

        {/* Metric 4: Next Doctor Visit */}
        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-2 font-medium">
            <span>Next Doctor Visit</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5E9B9] text-[#8B6B15] flex items-center justify-center font-bold">
              <CalendarDays className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base font-bold text-[#30352F] truncate mb-0.5">
            {upcomingAppointments[0] ? upcomingAppointments[0].doctorName : 'None scheduled'}
          </div>
          <p className="text-xs font-semibold text-[#B86234]">
            {upcomingAppointments[0] ? `${upcomingAppointments[0].date}` : 'Routine checkups up to date'}
          </p>
          <p className="text-[10px] text-[#77786F] truncate mt-1">
            {upcomingAppointments[0] ? upcomingAppointments[0].specialty : 'All healthy'}
          </p>
        </div>
      </div>

      {/* Main Grid: Today's Schedule on Left (2 cols), Adherence & Activity on Right (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Today's Medication Schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#30352F] tracking-tight">
                Today's Medication Schedule
              </h3>
              <p className="text-xs text-[#77786F]">
                Sorted chronologically by daily routine period
              </p>
            </div>

            {role !== 'elderly' && (
              <button
                onClick={() => setShowAddMedModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            )}
          </div>

          {/* Doses List */}
          <div className="space-y-3">
            {todayDoses.length === 0 ? (
              <div className="saathi-card p-8 text-center bg-white">
                <span className="text-3xl block mb-2">🌿</span>
                <p className="text-sm font-semibold text-[#30352F]">No medications scheduled for today</p>
                <p className="text-xs text-[#77786F] mt-1">All clear or add prescriptions in the medications tab.</p>
              </div>
            ) : (
              todayDoses.map((dose) => (
                <MedicationDoseCard
                  key={dose.id}
                  dose={dose}
                  isElderlyMode={isElderly}
                />
              ))
            )}
          </div>

          {/* Upcoming Appointments Quick Banner */}
          <div className="saathi-card p-5 bg-white space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#30352F] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#789B7D]" />
                <span>Upcoming Doctor Appointments</span>
              </h4>
              <button
                onClick={() => setActivePage('appointments')}
                className="text-xs font-semibold text-[#789B7D] hover:text-[#587A5D] flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-[#77786F]">No upcoming appointments scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#30352F]">
                        {apt.doctorName}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E6F1E8] text-[#587A5D]">
                        {apt.date}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#77786F] truncate">
                      {apt.specialty} • {apt.hospital}
                    </p>
                    <p className="text-[10px] text-[#587A5D] flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> {apt.accompaniedBy || 'Family Accompanied'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Weekly Adherence Chart & Care Activity */}
        <div className="space-y-6">
          {/* Adherence Chart Card */}
          <div className="saathi-card p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#30352F] tracking-tight">
                  7-Day Adherence Trend
                </h4>
                <p className="text-[11px] text-[#77786F]">Weekly compliance rate %</p>
              </div>
              <button
                onClick={() => setActivePage('adherence')}
                className="text-xs font-semibold text-[#789B7D] hover:underline"
              >
                Full Analytics
              </button>
            </div>

            {/* Recharts Bar Chart */}
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.dailyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="day"
                    stroke="#77786F"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#EAE9E2' }}
                  />
                  <YAxis
                    stroke="#77786F"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    ticks={[0, 50, 100]}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-xl border border-[#EAE9E2] shadow-card text-xs">
                            <p className="font-semibold text-[#30352F]">{d.day} ({d.date})</p>
                            <p className="text-[#587A5D] mt-0.5">Doses Taken: {d.taken} / {d.total}</p>
                            <p className="font-bold text-[#30352F]">{d.rate}% adherence</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                    {metrics.dailyHistory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.rate >= 90 ? '#789B7D' : entry.rate >= 70 ? '#E09B75' : '#D95C5C'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-[#EAE9E2] flex items-center justify-between text-xs text-[#77786F]">
              <span>Avg Weekly: <b className="text-[#30352F]">{metrics.overallRate}%</b></span>
              <span className="flex items-center gap-1 text-[#587A5D] font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> High Compliance
              </span>
            </div>
          </div>

          {/* Recent Timeline Activity */}
          <div className="saathi-card p-5 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#30352F] tracking-tight">
                  Care Circle Activity
                </h4>
                <p className="text-[11px] text-[#77786F]">Recent family and caretaker actions</p>
              </div>
              <button
                onClick={() => setActivePage('timeline')}
                className="text-xs font-semibold text-[#789B7D] hover:underline"
              >
                View Timeline
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#789B7D] mt-1.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#30352F] leading-snug">
                      {act.actor} <span className="font-normal text-[#77786F]">— {act.action}</span>
                    </p>
                    <p className="text-[11px] text-[#77786F] truncate">{act.details}</p>
                    <span className="text-[10px] text-[#77786F]/80">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMedicationModal
        isOpen={showAddMedModal}
        onClose={() => setShowAddMedModal(false)}
      />
      <AddAppointmentModal
        isOpen={showAddAptModal}
        onClose={() => setShowAddAptModal(false)}
      />
    </div>
  );
};
