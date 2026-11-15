import React, { useState } from 'react';
import { X, Pill, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Medication, TimeOfDay } from '../../types';
import { medicationService } from '../../services/medicationService';
import { useApp } from '../../context/AppContext';

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicationToEdit?: Medication;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  onClose,
  medicationToEdit,
}) => {
  const { currentUser, showToast } = useApp();

  const [name, setName] = useState(medicationToEdit?.name || '');
  const [dosage, setDosage] = useState(medicationToEdit?.dosage || '');
  const [frequency, setFrequency] = useState(medicationToEdit?.frequency || 'Once daily');
  const [reminderTime, setReminderTime] = useState(medicationToEdit?.reminderTimes[0] || '08:30 AM');
  const [startDate, setStartDate] = useState(
    medicationToEdit?.startDate || new Date().toISOString().split('T')[0]
  );
  const [instructions, setInstructions] = useState(medicationToEdit?.instructions || '');
  const [purpose, setPurpose] = useState(medicationToEdit?.purpose || '');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(medicationToEdit?.timeOfDay || 'morning');
  const [prescribedBy, setPrescribedBy] = useState(
    medicationToEdit?.prescribedBy || 'Dr. Rajesh Sharma'
  );
  const [colorTag, setColorTag] = useState<Medication['colorTag']>(
    medicationToEdit?.colorTag || 'sage'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) {
      alert('Please provide medication name and dosage.');
      return;
    }

    if (medicationToEdit) {
      medicationService.update(
        {
          ...medicationToEdit,
          name: name.trim(),
          dosage: dosage.trim(),
          frequency,
          reminderTimes: [reminderTime],
          startDate,
          instructions: instructions.trim() || 'Take as advised with water.',
          purpose: purpose.trim() || 'General Health Maintenance',
          timeOfDay,
          prescribedBy,
          colorTag,
        },
        currentUser.name,
        currentUser.role
      );
      showToast(`Updated ${name} prescription details.`, 'success');
    } else {
      medicationService.create(
        {
          name: name.trim(),
          dosage: dosage.trim(),
          frequency,
          reminderTimes: [reminderTime],
          startDate,
          instructions: instructions.trim() || 'Take as advised with water.',
          purpose: purpose.trim() || 'General Health Maintenance',
          timeOfDay,
          status: 'active',
          prescribedBy,
          colorTag,
        },
        currentUser.name,
        currentUser.role
      );
      showToast(`Added ${name} (${dosage}) to daily routine.`, 'success');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EAE9E2] shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE9E2] flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#E6F1E8] text-[#587A5D] flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#30352F]">
                {medicationToEdit ? 'Edit Medication' : 'Add New Medication'}
              </h3>
              <p className="text-xs text-[#77786F]">
                Fill in prescription details and reminder timing
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Medicine Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Telmisartan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Dosage *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 40 mg or 1 tablet"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              >
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Every other day">Every other day</option>
                <option value="As needed (SOS)">As needed (SOS)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Routine Period
              </label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              >
                <option value="morning">Morning Routine (Breakfast)</option>
                <option value="afternoon">Afternoon Routine (Lunch)</option>
                <option value="evening">Evening Routine (Tea/Snack)</option>
                <option value="night">Night Routine (Bedtime)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Reminder Time
              </label>
              <input
                type="text"
                placeholder="e.g. 08:30 AM"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#30352F] mb-1">
              Health Purpose / Indication
            </label>
            <input
              type="text"
              placeholder="e.g. Blood pressure regulation, Diabetic support"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#30352F] mb-1">
              Administration Instructions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Take 30 minutes after food with a warm glass of water."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Prescribing Doctor
              </label>
              <input
                type="text"
                value={prescribedBy}
                onChange={(e) => setPrescribedBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Card Color Theme
              </label>
              <div className="flex items-center gap-2 mt-1">
                {(['sage', 'peach', 'yellow', 'lavender'] as const).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setColorTag(tag)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      tag === 'sage'
                        ? 'bg-[#E6F1E8] border-[#789B7D]'
                        : tag === 'peach'
                        ? 'bg-[#FCE8D8] border-[#E09B75]'
                        : tag === 'yellow'
                        ? 'bg-[#F5E9B9] border-[#C8A336]'
                        : 'bg-[#E8EAF7] border-[#7A83B8]'
                    } ${colorTag === tag ? 'scale-110 shadow-xs' : 'opacity-70'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-[#EAE9E2] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#77786F] hover:text-[#30352F] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
            >
              {medicationToEdit ? 'Save Changes' : 'Add Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
