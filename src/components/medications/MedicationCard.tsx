import React from 'react';
import { Clock, Edit2, Trash2, Calendar, Package, AlertTriangle } from 'lucide-react';
import { Medication } from '../../types';
import { medicationService } from '../../services/medicationService';
import { useApp } from '../../context/AppContext';

export const MedicationCard: React.FC<{
  medication: Medication;
  onEdit: (med: Medication) => void;
}> = ({ medication, onEdit }) => {
  const { currentUser, role, showToast } = useApp();

  const colorTagStyles = {
    sage: 'bg-[#E6F1E8] border-[#789B7D]/40 text-[#587A5D]',
    peach: 'bg-[#FCE8D8] border-[#E09B75]/40 text-[#B86234]',
    yellow: 'bg-[#F5E9B9] border-[#C8A336]/40 text-[#8B6B15]',
    lavender: 'bg-[#E8EAF7] border-[#7A83B8]/40 text-[#505A8D]',
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${medication.name} from the prescription list?`)) {
      medicationService.delete(medication.id, currentUser.name, currentUser.role);
      showToast(`Removed ${medication.name}.`, 'info');
    }
  };

  return (
    <div className="saathi-card p-5 flex flex-col justify-between bg-white relative group">
      <div>
        {/* Top header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border ${
                colorTagStyles[medication.colorTag || 'sage']
              }`}
              aria-hidden="true"
            >
              💊
            </div>
            <div>
              <h4 className="font-semibold text-base text-[#30352F] tracking-tight">
                {medication.name}
              </h4>
              <span className="text-xs font-medium text-[#77786F]">
                {medication.dosage} • {medication.frequency}
              </span>
            </div>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              colorTagStyles[medication.colorTag || 'sage']
            }`}
          >
            {medication.timeOfDay}
          </span>
        </div>

        {/* Purpose */}
        <div className="mb-3 p-2.5 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2]">
          <p className="text-xs font-medium text-[#30352F]">
            🩺 <span className="font-semibold">Indication:</span> {medication.purpose}
          </p>
        </div>

        {/* Instructions */}
        <p className="text-xs text-[#77786F] mb-3 leading-relaxed">
          {medication.instructions}
        </p>

        {/* Precautions badge if available */}
        {medication.precautions && medication.precautions.length > 0 && (
          <div className="mb-3 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>{medication.precautions[0]}</span>
          </div>
        )}

        {/* Meta info */}
        <div className="space-y-1 text-[11px] text-[#77786F] border-t border-[#EAE9E2] pt-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#789B7D]" /> Reminder Time:
            </span>
            <span className="font-semibold text-[#30352F]">
              {medication.reminderTimes.join(', ')}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#789B7D]" /> Prescribed By:
            </span>
            <span className="font-medium text-[#30352F]">
              {medication.prescribedBy}
            </span>
          </div>

          {typeof medication.remainingPills === 'number' && (
            <div className="flex items-center justify-between pt-1">
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3 text-amber-600" /> Inventory / Supply:
              </span>
              <span className={`font-semibold ${medication.remainingPills <= 10 ? 'text-amber-700' : 'text-[#30352F]'}`}>
                {medication.remainingPills} / {medication.totalPills || 30} pills
                {medication.remainingPills <= 10 && ' (Low Supply)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons (Family or Caretaker can edit/delete) */}
      {role !== 'elderly' && (
        <div className="mt-4 pt-3 border-t border-[#EAE9E2] flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(medication)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-[#77786F] hover:text-[#30352F] hover:bg-[#FAF8F2] transition-colors cursor-pointer"
          >
            <Edit2 className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
