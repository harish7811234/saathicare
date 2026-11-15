import React, { useState } from 'react';
import {
  Clock,
  Pill,
  CalendarDays,
  Users2,
  AlertTriangle,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActivityLog } from '../types';

export const TimelinePage: React.FC = () => {
  const { data } = useApp();
  const [filter, setFilter] = useState<string>('all');

  const activities = data.activities || [];

  const filtered = activities.filter((act) => {
    if (filter === 'all') return true;
    return act.type === filter;
  });

  const getActorBadgeColor = (role: ActivityLog['actorRole']) => {
    switch (role) {
      case 'elderly':
        return 'bg-[#E6F1E8] text-[#587A5D] border-[#789B7D]/30';
      case 'family':
        return 'bg-[#FCE8D8] text-[#B86234] border-[#E09B75]/30';
      case 'caretaker':
        return 'bg-[#E8EAF7] text-[#505A8D] border-[#7A83B8]/30';
      default:
        return 'bg-[#FAF8F2] text-[#77786F] border-[#EAE9E2]';
    }
  };

  const getActionIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-4 h-4 text-[#789B7D]" />;
      case 'appointment':
        return <CalendarDays className="w-4 h-4 text-[#B86234]" />;
      case 'circle':
        return <Users2 className="w-4 h-4 text-[#505A8D]" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-[#D95C5C]" />;
      case 'profile':
        return <HeartPulse className="w-4 h-4 text-[#789B7D]" />;
      default:
        return <Clock className="w-4 h-4 text-[#77786F]" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="saathi-card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-xl font-bold tracking-tight text-[#30352F]">
              Care Activity Timeline
            </h2>
          </div>
          <p className="text-xs text-[#77786F]">
            Every dose confirmation, appointment booking, and alert logged with verified timestamps and actor signatures.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'medication', 'appointment', 'circle', 'alert', 'profile'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filter === t
                  ? 'bg-[#30352F] text-white shadow-xs'
                  : 'bg-[#FAF8F2] text-[#77786F] hover:text-[#30352F] border border-[#EAE9E2]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="saathi-card p-6 sm:p-8 bg-white relative">
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm font-semibold text-[#30352F]">No activities recorded for this filter</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#EAE9E2] ml-4 sm:ml-6 space-y-8 pb-4">
            {filtered.map((act) => (
              <div key={act.id} className="relative pl-6 sm:pl-8 group">
                {/* Node icon on line */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-white border-2 border-[#EAE9E2] group-hover:border-[#789B7D] flex items-center justify-center shadow-xs transition-colors">
                  {getActionIcon(act.type)}
                </div>

                {/* Content Box */}
                <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] space-y-1.5 transition-all hover:bg-white hover:shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#30352F]">
                        {act.action}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getActorBadgeColor(
                          act.actorRole
                        )}`}
                      >
                        {act.actor} ({act.actorRole})
                      </span>
                    </div>

                    <span className="text-xs text-[#77786F] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#77786F]" />
                      {act.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#77786F] leading-relaxed">
                    {act.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
