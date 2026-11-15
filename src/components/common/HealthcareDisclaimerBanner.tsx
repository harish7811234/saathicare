import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';

export const HealthcareDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Healthcare Disclaimer" className="bg-[#FFFDF5] border-b border-[#F5E9B9] px-4 py-2 text-xs text-[#8B6B15] relative z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert className="w-4 h-4 text-[#C8A336] flex-shrink-0" />
          <p className="leading-tight text-[11px] sm:text-xs">
            <span className="font-bold">Demonstration Prototype:</span> SaathiCare stores data locally in your browser and is not synchronised between users or devices. Do not enter real medical or personal information. SaathiCare does not provide medical advice or replace professional healthcare services.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-[#F5E9B9]/60 rounded-lg text-[#8B6B15] transition-colors flex-shrink-0"
          title="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
