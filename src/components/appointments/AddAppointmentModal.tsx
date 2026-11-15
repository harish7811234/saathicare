import React, { useState } from 'react';
import { X, CalendarDays } from 'lucide-react';
import { Appointment } from '../../types';
import { appointmentService } from '../../services/appointmentService';
import { useApp } from '../../context/AppContext';

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentToEdit?: Appointment;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointmentToEdit,
}) => {
  const { currentUser, showToast } = useApp();

  const [doctorName, setDoctorName] = useState(appointmentToEdit?.doctorName || '');
  const [specialty, setSpecialty] = useState(
    appointmentToEdit?.specialty || 'General Physician'
  );
  const [hospital, setHospital] = useState(appointmentToEdit?.hospital || '');
  const [date, setDate] = useState(
    () => appointmentToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState(appointmentToEdit?.time || '10:00 AM');
  const [purpose, setPurpose] = useState(appointmentToEdit?.purpose || '');
  const [contact, setContact] = useState(appointmentToEdit?.contact || '');
  const [notes, setNotes] = useState(appointmentToEdit?.notes || '');
  const [accompaniedBy, setAccompaniedBy] = useState(
    appointmentToEdit?.accompaniedBy || 'Aarav Patel (Son)'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim() || !hospital.trim() || !date || !purpose.trim()) {
      alert('Please fill in doctor name, clinic/hospital, date, and purpose.');
      return;
    }

    if (appointmentToEdit) {
      appointmentService.update(
        {
          ...appointmentToEdit,
          doctorName: doctorName.trim(),
          specialty: specialty.trim(),
          hospital: hospital.trim(),
          date,
          time,
          purpose: purpose.trim(),
          contact: contact.trim() || '+91 98000 00000',
          notes: notes.trim(),
          accompaniedBy: accompaniedBy.trim(),
        },
        currentUser.name,
        currentUser.role
      );
      showToast(`Updated appointment with ${doctorName}.`, 'success');
    } else {
      appointmentService.create(
        {
          doctorName: doctorName.trim(),
          specialty: specialty.trim(),
          hospital: hospital.trim(),
          date,
          time,
          purpose: purpose.trim(),
          contact: contact.trim() || '+91 98000 00000',
          notes: notes.trim(),
          accompaniedBy: accompaniedBy.trim(),
          status: 'upcoming',
        },
        currentUser.name,
        currentUser.role
      );
      showToast(`Scheduled visit with ${doctorName} on ${date}.`, 'success');
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-[#EAE9E2] shadow-elevated overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE9E2] flex items-center justify-between bg-[#FAF8F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FCE8D8] text-[#B86234] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#30352F]">
                {appointmentToEdit ? 'Edit Doctor Appointment' : 'Schedule New Appointment'}
              </h3>
              <p className="text-xs text-[#77786F]">
                Coordinate visits, clinic details, and accompanying family
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
                Doctor Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Rajesh Sharma"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Medical Specialty
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Cardiologist"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#30352F] mb-1">
              Hospital or Clinic Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Max Heart & Vascular Clinic, Indiranagar"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Time *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 10:30 AM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#30352F] mb-1">
              Purpose of Visit *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Quarterly ECG review & BP medication adjustment"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Clinic Contact Number
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98200 87654"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#30352F] mb-1">
                Accompanied By
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav Patel (Son) / Priya Shah"
                value={accompaniedBy}
                onChange={(e) => setAccompaniedBy(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#30352F] mb-1">
              Clinical Preparation / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Bring fasting blood reports and last 14 days BP record log."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#EAE9E2] bg-white text-sm text-[#30352F] focus:outline-none focus:border-[#789B7D]"
            />
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
              {appointmentToEdit ? 'Save Changes' : 'Schedule Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
