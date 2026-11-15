import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

export const DemoRoleSelectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { role, setRole, setActivePage } = useApp();

  if (!isOpen) return null;

  const rolesList: Array<{
    id: Role;
    avatar: string;
    name: string;
    roleLabel: string;
    description: string;
    capabilities: string[];
    bgAccent: string;
    borderAccent: string;
  }> = [
    {
      id: 'elderly',
      avatar: '👵',
      name: 'Meera Patel',
      roleLabel: 'Elderly User (Care Recipient - 72 yrs)',
      description: 'Simplified elder-first layout with today’s doses, 1-click confirmations and large text.',
      capabilities: [
        'View today’s scheduled doses',
        'Mark dose as taken or skipped with 1 click',
        'Check upcoming doctor visits',
        'View authorised family members & caretakers',
      ],
      bgAccent: 'bg-[#E6F1E8]',
      borderAccent: 'border-[#789B7D]',
    },
    {
      id: 'family',
      avatar: '👨‍💼',
      name: 'Aarav Patel',
      roleLabel: 'Family Member (Son & Primary Guardian)',
      description: 'Full oversight to manage prescriptions, schedule hospital visits, and monitor adherence.',
      capabilities: [
        'Add, edit and remove medications',
        'Schedule and coordinate doctor appointments',
        'Review 7-day adherence trends and logs',
        'Receive escalation alerts on unconfirmed doses',
      ],
      bgAccent: 'bg-[#FCE8D8]',
      borderAccent: 'border-[#E09B75]',
    },
    {
      id: 'caretaker',
      avatar: '👩‍⚕️',
      name: 'Priya Shah',
      roleLabel: 'Caretaker (Certified Geriatric Caregiver)',
      description: 'Operational view to record daily vitals, confirm administration, and report observations.',
      capabilities: [
        'Confirm assisted medication administration',
        'Record blood pressure, sugar, and pulse vitals',
        'View pending medication tasks for today',
        'Receive immediate notification when doses lapse',
      ],
      bgAccent: 'bg-[#E8EAF7]',
      borderAccent: 'border-[#7A83B8]',
    },
  ];

  const handleSelect = (r: Role) => {
    setRole(r);
    setActivePage('dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#EAE9E2] shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-[#EAE9E2] flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎭</span>
            <div>
              <h3 className="text-base font-semibold text-[#30352F]">
                Switch Demo Persona
              </h3>
              <p className="text-xs text-[#77786F]">
                Experience SaathiCare from three connected healthcare roles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77786F] hover:text-[#30352F] hover:bg-[#EAE9E2]/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {rolesList.map((item) => {
            const isCurrent = role === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isCurrent
                    ? `${item.bgAccent} ${item.borderAccent} shadow-sm`
                    : 'bg-[#FAF8F2] border-[#EAE9E2] hover:bg-white hover:border-[#789B7D] hover:shadow-card'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.avatar}</span>
                    <div>
                      <h4 className="font-bold text-base text-[#30352F]">
                        {item.name}
                      </h4>
                      <p className="text-xs font-medium text-[#77786F]">
                        {item.roleLabel}
                      </p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#30352F] shadow-xs">
                      Active Role
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#789B7D] flex items-center gap-1">
                      <span>Switch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#77786F] mb-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#30352F]">
                  {item.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[#587A5D]">✓</span>
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
