import React, { useState } from 'react';
import {
  UserPlus,
  Key,
  Phone,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { careCircleService } from '../services/careCircleService';
import { CareMember } from '../types';
import { InviteMemberModal } from '../components/circle/InviteMemberModal';

export const CareCirclePage: React.FC = () => {
  const { role, currentUser, data, showToast } = useApp();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const members = data.careCircle || [];

  const handleRemove = (member: CareMember) => {
    if (member.isPrimary) {
      alert('Primary profile owner cannot be removed.');
      return;
    }
    if (window.confirm(`Remove ${member.name} from the Care Circle?`)) {
      careCircleService.removeMember(member.id, currentUser.name, currentUser.role);
      showToast(`Removed ${member.name} from Care Circle.`, 'info');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="saathi-card p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤝</span>
            <h2 className="text-xl font-bold tracking-tight text-[#30352F]">
              Meera Patel's Care Circle
            </h2>
          </div>
          <p className="text-xs text-[#77786F]">
            A shared, transparent space where family members, caretakers, and clinicians collaborate.
          </p>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite / Join with Code</span>
        </button>
      </div>

      {/* Circle Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="saathi-card p-5 bg-white flex flex-col justify-between relative group"
          >
            <div>
              {/* Member Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] flex items-center justify-center text-2xl shadow-xs">
                    {member.avatar || '👤'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#30352F] tracking-tight">
                        {member.name}
                      </h4>
                      {member.isPrimary && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E6F1E8] text-[#587A5D]">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-[#77786F]">
                      {member.relation}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    member.role === 'elderly'
                      ? 'bg-[#E6F1E8] text-[#587A5D]'
                      : member.role === 'family'
                      ? 'bg-[#FCE8D8] text-[#B86234]'
                      : 'bg-[#E8EAF7] text-[#505A8D]'
                  }`}
                >
                  {member.role}
                </span>
              </div>

              {/* Responsibilities list */}
              <div className="mb-4 space-y-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77786F] block">
                  Care Responsibilities
                </span>
                <div className="space-y-1">
                  {member.responsibilities.map((resp, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-[#30352F]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#789B7D]" />
                      <span>{resp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer with Contact info & Remove */}
            <div className="pt-3 border-t border-[#EAE9E2] flex items-center justify-between text-xs text-[#77786F]">
              <div className="flex items-center gap-3">
                <a
                  href={`tel:${member.phone}`}
                  className="hover:text-[#30352F] flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#789B7D]" />
                  <span>{member.phone}</span>
                </a>
              </div>

              {!member.isPrimary && role !== 'elderly' && (
                <button
                  onClick={() => handleRemove(member)}
                  className="text-xs text-[#D95C5C] hover:text-[#B84040] p-1 rounded-lg transition-colors"
                  title="Remove from circle"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invite Code Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77786F]">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-[#789B7D] flex-shrink-0" />
          <span>
            Active Demo Invite Code: <strong className="text-[#30352F] font-mono font-bold">582914</strong> (Role: Caretaker). Use this code in the modal to test joining.
          </span>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="text-xs font-semibold text-[#789B7D] hover:underline whitespace-nowrap"
        >
          Open Code Manager →
        </button>
      </div>

      {/* Invite Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};
