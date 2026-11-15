import React, { useState } from 'react';
import { Check, X, Clock, AlertCircle, ShieldCheck, Volume2, VolumeX, AlertTriangle, Package } from 'lucide-react';
import { MedicationDose } from '../../types';
import { useApp } from '../../context/AppContext';

export const MedicationDoseCard: React.FC<{
  dose: MedicationDose;
  isElderlyMode?: boolean;
}> = ({ dose, isElderlyMode = false }) => {
  const { confirmDose, showToast } = useApp();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const colorTagStyles = {
    sage: 'bg-[#E6F1E8] border-[#789B7D]/30 text-[#587A5D]',
    peach: 'bg-[#FCE8D8] border-[#E09B75]/30 text-[#B86234]',
    yellow: 'bg-[#F5E9B9] border-[#C8A336]/30 text-[#8B6B15]',
    lavender: 'bg-[#E8EAF7] border-[#7A83B8]/30 text-[#505A8D]',
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported in this browser.', 'info');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active speech
    const speechText = `Reminder: Please take your ${dose.medicationName}, dosage ${dose.dosage}, scheduled for ${dose.scheduledTime}. Instructions: ${dose.instructions}.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.85; // slightly slower for elderly comprehension
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const statusBadges = {
    taken: (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E6F1E8] text-[#587A5D]">
        <Check className="w-3.5 h-3.5" /> Taken {dose.actionTimestamp && `at ${dose.actionTimestamp}`}
      </span>
    ),
    skipped: (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FCE8D8] text-[#B86234]">
        <X className="w-3.5 h-3.5" /> Skipped
      </span>
    ),
    missed: (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAD8D8] text-[#D95C5C] animate-pulse">
        <AlertCircle className="w-3.5 h-3.5" /> Missed Dose
      </span>
    ),
    upcoming: (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF8F2] border border-[#EAE9E2] text-[#77786F]">
        <Clock className="w-3.5 h-3.5" /> Scheduled
      </span>
    ),
    unconfirmed: (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5E9B9] text-[#8B6B15]">
        <Clock className="w-3.5 h-3.5" /> Pending Confirmation
      </span>
    ),
  };

  return (
    <div
      className={`saathi-card p-4 sm:p-5 relative transition-all ${
        dose.status === 'taken'
          ? 'bg-white/95 border-[#E6F1E8]'
          : dose.status === 'missed'
          ? 'bg-[#FFF8F8] border-[#FAD8D8]'
          : 'bg-white'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Medicine Information */}
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm border flex-shrink-0 ${
              colorTagStyles[dose.colorTag || 'sage']
            } ${isElderlyMode ? 'w-13 h-13 text-base' : ''}`}
            aria-hidden="true"
          >
            💊
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4
                className={`font-semibold text-[#30352F] tracking-tight ${
                  isElderlyMode ? 'text-lg sm:text-xl' : 'text-base'
                }`}
              >
                {dose.medicationName}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                  colorTagStyles[dose.colorTag || 'sage']
                }`}
              >
                {dose.dosage}
              </span>

              {/* Text-to-speech voice announcer button */}
              <button
                onClick={handleSpeak}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isSpeaking
                    ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                }`}
                title={isSpeaking ? 'Stop voice reading' : 'Read instructions aloud (Elderly Voice Assist)'}
                aria-label={`Read instructions for ${dose.medicationName} aloud`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              {/* Pill remaining alert */}
              {typeof dose.remainingPills === 'number' && dose.remainingPills <= 10 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <Package className="w-3 h-3" />
                  {dose.remainingPills} left
                </span>
              )}

              <div className="sm:hidden">{statusBadges[dose.status]}</div>
            </div>

            <p className="text-xs text-[#77786F] mb-1">
              ⏰ Scheduled for <span className="font-semibold text-[#30352F]">{dose.scheduledTime}</span> •{' '}
              {dose.instructions}
            </p>

            {/* Precautions badge if available */}
            {dose.precautions && dose.precautions.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit mb-1">
                <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600" />
                <span>Precaution: {dose.precautions[0]}</span>
              </div>
            )}

            {dose.actionBy && (
              <p className="text-[11px] text-[#587A5D] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Confirmed by {dose.actionBy}
              </p>
            )}

            {dose.notes && (
              <p className="text-[11px] text-[#B86234] italic mt-0.5">
                Note: {dose.notes}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Status */}
        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          <div className="hidden sm:block">{statusBadges[dose.status]}</div>

          {dose.status !== 'taken' && dose.status !== 'skipped' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => confirmDose(dose.id, 'taken')}
                className={`flex items-center gap-1.5 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white font-semibold shadow-xs transition-transform active:scale-95 cursor-pointer ${
                  isElderlyMode
                    ? 'px-4 py-2.5 text-sm font-bold'
                    : 'px-3 py-1.5 text-xs'
                }`}
                aria-label={`Mark ${dose.medicationName} as taken`}
              >
                <Check className={isElderlyMode ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
                <span>Mark Taken</span>
              </button>

              <button
                onClick={() => confirmDose(dose.id, 'skipped')}
                className={`flex items-center gap-1 rounded-xl bg-white border border-[#EAE9E2] text-[#77786F] hover:text-[#30352F] hover:bg-[#FAF8F2] font-medium transition-colors cursor-pointer ${
                  isElderlyMode
                    ? 'px-3 py-2 text-sm'
                    : 'px-2.5 py-1.5 text-xs'
                }`}
                aria-label={`Skip dose of ${dose.medicationName}`}
              >
                <span>Skip</span>
              </button>
            </div>
          )}

          {dose.status === 'taken' && (
            <button
              onClick={() => confirmDose(dose.id, 'upcoming')}
              className="text-[11px] text-[#77786F] hover:text-[#30352F] underline underline-offset-2 ml-1 cursor-pointer"
            >
              Undo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
