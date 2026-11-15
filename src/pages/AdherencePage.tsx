import React from 'react';
import {
  LineChart as LineChartIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { medicationService } from '../services/medicationService';

export const AdherencePage: React.FC = () => {
  const { data } = useApp();
  const metrics = medicationService.getAdherenceMetrics();

  // Pie chart distribution
  const distributionData = [
    { name: 'Taken as Prescribed', value: metrics.takenDoses, color: '#789B7D' },
    { name: 'Intentionally Skipped', value: metrics.skippedDoses, color: '#E09B75' },
    { name: 'Missed Window', value: metrics.missedDoses, color: '#D95C5C' },
  ].filter((item) => item.value > 0);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-1 font-medium">
            <span>Overall Adherence</span>
            <Award className="w-4 h-4 text-[#789B7D]" />
          </div>
          <div className="text-3xl font-extrabold text-[#30352F] tracking-tight">
            {metrics.overallRate}%
          </div>
          <p className="text-[11px] text-[#587A5D] font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Exceeds 85% clinical target
          </p>
        </div>

        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-1 font-medium">
            <span>Doses Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-[#587A5D]" />
          </div>
          <div className="text-3xl font-extrabold text-[#30352F] tracking-tight">
            {metrics.takenDoses}
          </div>
          <p className="text-[11px] text-[#77786F] mt-1">
            Out of {metrics.totalDoses} total scheduled doses
          </p>
        </div>

        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-1 font-medium">
            <span>Skipped Doses</span>
            <Clock className="w-4 h-4 text-[#E09B75]" />
          </div>
          <div className="text-3xl font-extrabold text-[#30352F] tracking-tight">
            {metrics.skippedDoses}
          </div>
          <p className="text-[11px] text-[#77786F] mt-1">
            With clinical reason or user note
          </p>
        </div>

        <div className="saathi-card p-5 bg-white">
          <div className="flex items-center justify-between text-xs text-[#77786F] mb-1 font-medium">
            <span>Missed Window Alerts</span>
            <AlertTriangle className="w-4 h-4 text-[#D95C5C]" />
          </div>
          <div className="text-3xl font-extrabold text-[#30352F] tracking-tight">
            {metrics.missedDoses}
          </div>
          <p className="text-[11px] text-[#D95C5C] mt-1">
            Escalated to Caregiver & Family
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Bar Chart: 7-Day History */}
        <div className="lg:col-span-2 saathi-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#30352F] tracking-tight">
                7-Day Compliance Rate (%)
              </h3>
              <p className="text-xs text-[#77786F]">
                Derived from individual dose confirmation records
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#77786F]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#789B7D]" /> ≥90%
              </span>
              <span className="flex items-center gap-1.5 text-[#77786F]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E09B75]" /> 70-89%
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.dailyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  stroke="#77786F"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#EAE9E2' }}
                />
                <YAxis
                  stroke="#77786F"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl border border-[#EAE9E2] shadow-card text-xs space-y-1">
                          <p className="font-bold text-[#30352F]">{d.day} • {d.date}</p>
                          <p className="text-[#587A5D]">Doses Taken: {d.taken} / {d.total}</p>
                          <p className="font-semibold text-[#30352F]">Adherence Rate: {d.rate}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
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

          <div className="p-3 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] flex items-center justify-between text-xs text-[#77786F]">
            <span>Consistent morning routine observed: <strong>94% on-time rate</strong></span>
            <span className="text-[#587A5D] font-medium">✓ Routine Stable</span>
          </div>
        </div>

        {/* Donut Distribution Chart */}
        <div className="saathi-card p-6 bg-white space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#30352F] tracking-tight">
              Dose Status Distribution
            </h3>
            <p className="text-xs text-[#77786F]">Proportion across all logged doses</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-2.5 rounded-xl border border-[#EAE9E2] shadow-card text-xs">
                          <p className="font-bold text-[#30352F]">{d.name}</p>
                          <p className="text-[#77786F]">{d.value} doses</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#EAE9E2]">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#30352F] font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-[#30352F]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Headspace-Inspired Care Insights */}
      <div className="saathi-card p-6 bg-white space-y-4">
        <h3 className="text-base font-bold text-[#30352F] tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#789B7D]" />
          <span>Care Insights & Routine Stability</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#E6F1E8]/50 border border-[#789B7D]/20 space-y-1.5">
            <span className="text-xs font-bold text-[#587A5D] uppercase tracking-wider block">
              Morning Synchrony
            </span>
            <p className="text-xs font-semibold text-[#30352F]">
              Meera takes Telmisartan within 15 minutes of breakfast.
            </p>
            <p className="text-[11px] text-[#77786F]">
              Consistent morning timing ensures stable blood pressure throughout the day.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FCE8D8]/50 border border-[#E09B75]/20 space-y-1.5">
            <span className="text-xs font-bold text-[#B86234] uppercase tracking-wider block">
              Afternoon Reminder
            </span>
            <p className="text-xs font-semibold text-[#30352F]">
              Shelcal Calcium occasionally delayed when out of house.
            </p>
            <p className="text-[11px] text-[#77786F]">
              Priya carries a travel pill dispenser during afternoon park visits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#E8EAF7]/50 border border-[#7A83B8]/20 space-y-1.5">
            <span className="text-xs font-bold text-[#505A8D] uppercase tracking-wider block">
              Doctor Alignment
            </span>
            <p className="text-xs font-semibold text-[#30352F]">
              Report ready for Dr. Rajesh Sharma’s cardiology visit.
            </p>
            <p className="text-[11px] text-[#77786F]">
              92% 30-day compliance data will be presented during consultation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
