import React from 'react';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#587A5D]" />,
    alert: <AlertTriangle className="w-4 h-4 text-[#B86234]" />,
    info: <Info className="w-4 h-4 text-[#505A8D]" />,
  };

  const bgColors = {
    success: 'bg-[#E6F1E8] border-[#789B7D]/40 text-[#30352F]',
    alert: 'bg-[#FCE8D8] border-[#E09B75]/40 text-[#30352F]',
    info: 'bg-[#FAF8F2] border-[#EAE9E2] text-[#30352F]',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm transition-all duration-300 animate-slide-up">
      <div
        className={`flex items-center gap-3 p-3.5 rounded-2xl border shadow-card backdrop-blur-md ${
          bgColors[toast.type]
        }`}
      >
        <div className="flex-shrink-0">{icons[toast.type]}</div>
        <p className="text-xs sm:text-sm font-medium leading-tight">{toast.message}</p>
      </div>
    </div>
  );
};
