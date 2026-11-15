import React from 'react';
import { Calendar, Clock, MapPin, Phone, UserCheck, AlertCircle, Edit2, XCircle, Trash2 } from 'lucide-react';
import { Appointment } from '../../types';
import { appointmentService } from '../../services/appointmentService';
import { useApp } from '../../context/AppContext';

export const AppointmentCard: React.FC<{
  appointment: Appointment;
  onEdit: (apt: Appointment) => void;
}> = ({ appointment, onEdit }) => {
  const { currentUser, role, showToast } = useApp();

  const handleCancel = () => {
    if (window.confirm(`Cancel the upcoming appointment with ${appointment.doctorName}?`)) {
      appointmentService.cancel(appointment.id, currentUser.name, currentUser.role);
      showToast(`Appointment with ${appointment.doctorName} marked cancelled.`, 'alert');
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Permanently remove appointment record for ${appointment.doctorName}?`)) {
      appointmentService.delete(appointment.id, currentUser.name, currentUser.role);
      showToast(`Deleted appointment with ${appointment.doctorName}.`, 'info');
    }
  };

  const isUpcoming = appointment.status === 'upcoming';

  return (
    <div
      className={`saathi-card p-5 relative transition-all ${
        isUpcoming ? 'bg-white' : 'bg-[#FAF8F2]/70 border-[#EAE9E2]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left: Date pill + Details */}
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FCE8D8] text-[#B86234] flex flex-col items-center justify-center flex-shrink-0 border border-[#E09B75]/20 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short' })}
            </span>
            <span className="text-xl font-bold leading-tight">
              {new Date(appointment.date).getDate()}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="font-semibold text-base text-[#30352F] tracking-tight">
                {appointment.doctorName}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#E6F1E8] text-[#587A5D]">
                {appointment.specialty}
              </span>

              {appointment.status === 'cancelled' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FAD8D8] text-[#D95C5C]">
                  Cancelled
                </span>
              )}
              {appointment.status === 'completed' && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FAF8F2] border border-[#EAE9E2] text-[#77786F]">
                  Completed
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-[#30352F] mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#789B7D] flex-shrink-0" />
              <span>{appointment.hospital}</span>
            </p>

            <p className="text-xs text-[#77786F] mb-2">
              <span className="font-semibold text-[#30352F]">Purpose:</span> {appointment.purpose}
            </p>

            {appointment.accompaniedBy && (
              <p className="text-[11px] text-[#587A5D] flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Accompanied by: {appointment.accompaniedBy}
              </p>
            )}

            {appointment.notes && (
              <div className="mt-2 p-2 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] text-[11px] text-[#77786F]">
                💡 <span className="font-medium text-[#30352F]">Instructions:</span> {appointment.notes}
              </div>
            )}
          </div>
        </div>

        {/* Right: Time, Contact & Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] text-xs font-semibold text-[#30352F]">
            <Clock className="w-3.5 h-3.5 text-[#789B7D]" />
            <span>{appointment.time}</span>
          </div>

          {appointment.contact && (
            <a
              href={`tel:${appointment.contact}`}
              className="text-[11px] text-[#77786F] hover:text-[#30352F] flex items-center gap-1 mt-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#789B7D]" />
              <span>{appointment.contact}</span>
            </a>
          )}

          {role !== 'elderly' && (
            <div className="flex items-center gap-1 mt-2">
              {isUpcoming && (
                <>
                  <button
                    onClick={() => onEdit(appointment)}
                    className="p-1.5 text-xs text-[#77786F] hover:text-[#30352F] hover:bg-[#FAF8F2] rounded-lg transition-colors"
                    title="Edit appointment"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="p-1.5 text-xs text-[#D95C5C] hover:bg-[#FFF0F0] rounded-lg transition-colors"
                    title="Cancel appointment"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <button
                onClick={handleDelete}
                className="p-1.5 text-xs text-[#77786F] hover:text-[#D95C5C] hover:bg-[#FFF0F0] rounded-lg transition-colors"
                title="Delete appointment"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
