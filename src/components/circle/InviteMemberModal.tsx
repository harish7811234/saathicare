import React, { useState } from 'react';
import { X, Users, Key, Copy, Check, ShieldAlert, Sparkles, UserPlus } from 'lucide-react';
import { Role } from '../../types';
import { careCircleService } from '../../services/careCircleService';
import { useApp } from '../../context/AppContext';

export const InviteMemberModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { currentUser, showToast } = useApp();

  const [mode, setMode] = useState<'generate' | 'join'>('generate');
  const [selectedRole, setSelectedRole] = useState<Role>('caretaker');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Form fields for joining with code
  const [joinCode, setJoinCode] = useState<string>('');
  const [joinName, setJoinName] = useState<string>('');
  const [joinRelation, setJoinRelation] = useState<string>('');
  const [joinPhone, setJoinPhone] = useState<string>('');
  const [joinEmail, setJoinEmail] = useState<string>('');
  const [joinError, setJoinError] = useState<string>('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    const code = careCircleService.generateInviteCode(selectedRole, currentUser.name, currentUser.role);
    setGeneratedCode(code);
    showToast(`Generated 6-digit invite code: ${code}`, 'success');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('Invite code copied to clipboard!', 'info');
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError('');

    if (!joinCode || joinCode.length !== 6) {
      setJoinError('Please enter a valid 6-digit invitation code.');
      return;
    }
    if (!joinName.trim()) {
      setJoinError('Please provide your name.');
      return;
    }

    const res = careCircleService.joinWithCode({
      code: joinCode.trim(),
      name: joinName.trim(),
      relation: joinRelation.trim(),
      phone: joinPhone.trim(),
      email: joinEmail.trim(),
    });

    if (!res.success) {
      setJoinError(res.error || 'Failed to join with this code.');
      return;
    }

    showToast(`Welcome! ${res.member?.name} joined the Care Circle.`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EAE9E2] shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE9E2] flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6F1E8] text-[#587A5D] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#30352F]">
                Care Circle Collaboration
              </h3>
              <p className="text-xs text-[#77786F]">
                Simulated 6-digit access code invitation system
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#77786F] hover:text-[#30352F] hover:bg-[#EAE9E2]/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 flex gap-2 border-b border-[#EAE9E2]">
          <button
            onClick={() => setMode('generate')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              mode === 'generate'
                ? 'border-[#789B7D] text-[#30352F]'
                : 'border-transparent text-[#77786F] hover:text-[#30352F]'
            }`}
          >
            Generate Invite Code
          </button>
          <button
            onClick={() => setMode('join')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors ${
              mode === 'join'
                ? 'border-[#789B7D] text-[#30352F]'
                : 'border-transparent text-[#77786F] hover:text-[#30352F]'
            }`}
          >
            Join with Code
          </button>
        </div>

        {/* Notice Badge */}
        <div className="mx-6 mt-3 p-2.5 rounded-xl bg-[#FDFBEF] border border-[#F5E9B9] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-[#C8A336] flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#8B6B15] leading-tight">
            <span className="font-semibold">Demo Notice:</span> This is a simulated invitation workflow for hackathon demonstration, not production-grade cryptographic authentication.
          </p>
        </div>

        {/* Body */}
        {mode === 'generate' ? (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1.5">
                Invite For Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('caretaker')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'caretaker'
                      ? 'bg-[#E6F1E8] border-[#789B7D] text-[#30352F]'
                      : 'bg-white border-[#EAE9E2] text-[#77786F] hover:bg-[#FAF8F2]'
                  }`}
                >
                  <span className="text-xl block mb-1">👩‍⚕️</span>
                  <span className="text-xs font-semibold block text-[#30352F]">
                    Caretaker / Nurse
                  </span>
                  <span className="text-[10px] text-[#77786F]">
                    Confirm doses & log vitals
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('family')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'family'
                      ? 'bg-[#FCE8D8] border-[#E09B75] text-[#30352F]'
                      : 'bg-white border-[#EAE9E2] text-[#77786F] hover:bg-[#FAF8F2]'
                  }`}
                >
                  <span className="text-xl block mb-1">👨‍💼</span>
                  <span className="text-xs font-semibold block text-[#30352F]">
                    Family Member
                  </span>
                  <span className="text-[10px] text-[#77786F]">
                    Manage meds & appointments
                  </span>
                </button>
              </div>
            </div>

            {generatedCode ? (
              <div className="p-4 rounded-2xl bg-[#FAF8F2] border border-[#EAE9E2] text-center space-y-2">
                <span className="text-xs text-[#77786F] block">Share this 6-digit access code:</span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-extrabold tracking-widest text-[#30352F] font-mono">
                    {generatedCode}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-white border border-[#EAE9E2] text-[#77786F] hover:text-[#30352F] shadow-xs transition-colors"
                    title="Copy Code"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#587A5D]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#587A5D]">
                  ✓ Valid for 7 days. Anyone with this code can join as {selectedRole.toUpperCase()}.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full py-3 rounded-2xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Key className="w-4 h-4" />
                <span>Generate 6-Digit Invitation Code</span>
              </button>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#77786F] hover:text-[#30352F]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="p-6 space-y-3">
            {joinError && (
              <div className="p-2.5 rounded-xl bg-[#FFF0F0] border border-[#FAD8D8] text-xs font-medium text-[#D95C5C]">
                {joinError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                6-Digit Invitation Code *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="e.g. 582914"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] text-center font-mono text-lg font-bold tracking-widest text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
              <span className="text-[10px] text-[#77786F] block mt-1">
                (Tip: Use seeded code <code className="font-bold text-[#30352F]">582914</code> or generate one above)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#30352F] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] text-xs text-[#30352F] focus:outline-none focus:border-[#789B7D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30352F] mb-1">
                  Relationship / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grandson / Weekend Nurse"
                  value={joinRelation}
                  onChange={(e) => setJoinRelation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] text-xs text-[#30352F] focus:outline-none focus:border-[#789B7D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#30352F] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98111 22334"
                  value={joinPhone}
                  onChange={(e) => setJoinPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] text-xs text-[#30352F] focus:outline-none focus:border-[#789B7D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#30352F] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="rahul@example.com"
                  value={joinEmail}
                  onChange={(e) => setJoinEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] text-xs text-[#30352F] focus:outline-none focus:border-[#789B7D]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE9E2] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#77786F] hover:text-[#30352F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs"
              >
                Join Care Circle
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
