import React from 'react';
import {
  LayoutDashboard,
  Pill,
  LineChart,
  CalendarDays,
  Users2,
  HeartPulse,
  Bell,
  Clock,
  Settings,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp, AppPage } from '../../context/AppContext';

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roleScope?: string;
}

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { activePage, setActivePage, role, data, unreadCount, currentUser } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'adherence', label: 'Adherence', icon: LineChart },
    { id: 'appointments', label: 'Appointments', icon: CalendarDays },
    { id: 'care-circle', label: 'Care Circle', icon: Users2 },
    { id: 'profile', label: 'Health Profile', icon: HeartPulse },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'timeline', label: 'Care Timeline', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#FAF8F2] border-r border-[#EAE9E2] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#EAE9E2]">
          <div
            onClick={() => {
              setActivePage('landing');
              onClose();
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#789B7D] flex items-center justify-center text-white font-semibold text-lg shadow-soft group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#FAF8F2]" />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-[#30352F] block leading-tight">
                SaathiCare
              </span>
              <span className="text-[11px] font-medium text-[#77786F] tracking-wide block">
                Care That Connects
              </span>
            </div>
          </div>

          {/* Quick Elderly Recipient Badge */}
          <div className="mt-4 p-2.5 rounded-xl bg-[#FFFFFF] border border-[#EAE9E2] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">👵</span>
              <div>
                <span className="text-xs font-semibold text-[#30352F] block">
                  {data.profile.name}
                </span>
                <span className="text-[10px] text-[#77786F] block">
                  {data.profile.age} yrs • Blood {data.profile.bloodGroup}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#E6F1E8] text-[#587A5D]">
              Active
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#77786F]">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#E6F1E8] text-[#30352F] font-semibold shadow-xs'
                    : 'text-[#77786F] hover:bg-[#FAF8F2] hover:text-[#30352F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#789B7D]' : 'text-[#77786F]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#E09B75] text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Role Status & Landing Link */}
        <div className="p-3 border-t border-[#EAE9E2] bg-[#FAF8F2] space-y-2">
          {/* Active Demo Persona */}
          <div className="p-3 rounded-xl bg-white border border-[#EAE9E2] shadow-xs">
            <div className="text-[10px] font-medium text-[#77786F] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Current Demo Persona</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#789B7D]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">{currentUser.avatar}</span>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-[#30352F] truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#77786F] capitalize truncate">
                  {role} view • {currentUser.relation}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setActivePage('landing');
              onClose();
            }}
            className="w-full text-xs font-medium text-[#77786F] hover:text-[#30352F] py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Back to Landing Page</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </aside>
    </>
  );
};
