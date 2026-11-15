import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Users2,
  Calendar,
  Filter,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { notificationService } from '../services/notificationService';
import { NotificationCategory } from '../types';

export const NotificationsPage: React.FC = () => {
  const { data, role, simulateMissedDose, isSimulating, showToast } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const notifications = data.notifications || [];

  const filteredNotifs = notifications.filter((n) => {
    if (categoryFilter === 'all') return true;
    return n.category === categoryFilter;
  });

  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    showToast('All notifications marked as read.', 'info');
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'missed_dose':
        return <AlertTriangle className="w-4 h-4 text-[#D95C5C]" />;
      case 'medication':
        return <Clock className="w-4 h-4 text-[#587A5D]" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-[#B86234]" />;
      case 'care_circle':
        return <Users2 className="w-4 h-4 text-[#505A8D]" />;
      default:
        return <Bell className="w-4 h-4 text-[#77786F]" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header and Simulation Banner */}
      <div className="saathi-card p-6 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h2 className="text-xl font-bold tracking-tight text-[#30352F]">
              Care Alerts & Notification Feed
            </h2>
          </div>
          <p className="text-xs text-[#77786F]">
            Transparent real-time escalation and reminder delivery across all Care Circle roles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              notificationService.create({
                title: 'Hydration & Walk Reminder',
                message: 'Gentle reminder for Meera: 15-minute afternoon stroll and a glass of water.',
                category: 'care_circle',
                priority: 'normal',
                targetRole: 'all',
              });
              showToast('Generated sample care alert notification.', 'info');
            }}
            className="px-3 py-2 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] text-[#30352F] hover:bg-[#EAE9E2]/50 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>+ Generate Care Alert</span>
          </button>

          <button
            onClick={simulateMissedDose}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border shadow-xs transition-transform active:scale-95 ${
              isSimulating
                ? 'bg-[#FAD8D8] text-[#D95C5C] border-[#FAD8D8] animate-pulse'
                : 'bg-white text-[#B86234] border-[#FCE8D8] hover:bg-[#FCE8D8]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Missed Dose</span>
          </button>

          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] text-[#30352F] hover:bg-[#EAE9E2]/50 text-xs font-semibold transition-colors"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: 'all', label: 'All Notifications' },
            { id: 'missed_dose', label: 'Missed Doses / Escalations' },
            { id: 'medication', label: 'Routine Reminders' },
            { id: 'appointment', label: 'Appointments' },
            { id: 'care_circle', label: 'Care Circle' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === tab.id
                ? 'bg-[#30352F] text-white shadow-xs'
                : 'bg-white text-[#77786F] hover:text-[#30352F] border border-[#EAE9E2]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="saathi-card p-10 text-center bg-white">
            <span className="text-3xl block mb-2">🎉</span>
            <p className="text-sm font-semibold text-[#30352F]">All caught up!</p>
            <p className="text-xs text-[#77786F] mt-1">No notifications in this category.</p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id)}
              className={`saathi-card p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer transition-all ${
                !n.read
                  ? n.priority === 'escalation'
                    ? 'bg-[#FFF8F8] border-[#FAD8D8] shadow-sm'
                    : 'bg-white border-[#789B7D]/40 shadow-xs'
                  : 'bg-white/80 border-[#EAE9E2] opacity-85'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    n.priority === 'escalation'
                      ? 'bg-[#FAD8D8]'
                      : n.category === 'medication'
                      ? 'bg-[#E6F1E8]'
                      : n.category === 'appointment'
                      ? 'bg-[#FCE8D8]'
                      : 'bg-[#E8EAF7]'
                  }`}
                >
                  {getCategoryIcon(n.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-sm text-[#30352F]">
                      {n.title}
                    </h4>

                    {n.isSimulated && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5E9B9] text-[#8B6B15]">
                        Demo Simulation
                      </span>
                    )}

                    {n.priority === 'escalation' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAD8D8] text-[#D95C5C] animate-pulse">
                        Escalation
                      </span>
                    )}

                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#E09B75]" />
                    )}
                  </div>

                  <p className="text-xs text-[#77786F] leading-relaxed">
                    {n.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-[#77786F]">
                    <span>{n.timestamp}</span>
                    <span>•</span>
                    <span className="capitalize">Target: {n.targetRole || 'all'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    notificationService.toggleRead(n.id);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    !n.read
                      ? 'bg-[#E6F1E8] border-[#789B7D]/40 text-[#587A5D] hover:bg-[#789B7D] hover:text-white'
                      : 'bg-[#FAF8F2] border-[#EAE9E2] text-[#77786F] hover:text-[#30352F]'
                  }`}
                >
                  {!n.read ? 'Mark read' : 'Mark unread'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Email Integration Note (Section 11) */}
      <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] text-xs text-[#77786F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>📬</span>
          <span>
            <strong>Production Architecture:</strong> Notifications are simulated for this 3-hour MVP. Clean email delivery abstraction ready for future Resend API integration.
          </span>
        </div>
      </div>
    </div>
  );
};
