import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Calendar,
  Filter,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { appointmentService } from '../services/appointmentService';
import { Appointment } from '../types';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import { AddAppointmentModal } from '../components/appointments/AddAppointmentModal';

export const AppointmentsPage: React.FC = () => {
  const { role, data } = useApp();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | undefined>(undefined);

  const upcomingApts = appointmentService.getUpcoming();
  const pastApts = appointmentService.getPast();

  const currentList = tab === 'upcoming' ? upcomingApts : pastApts;
  const filteredList = currentList.filter(
    (apt) =>
      apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      apt.hospital.toLowerCase().includes(search.toLowerCase()) ||
      apt.specialty.toLowerCase().includes(search.toLowerCase()) ||
      apt.purpose.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (apt: Appointment) => {
    setAppointmentToEdit(apt);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Tabs and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#EAE9E2] shadow-xs w-fit">
          <button
            onClick={() => setTab('upcoming')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              tab === 'upcoming'
                ? 'bg-[#E6F1E8] text-[#30352F] shadow-xs'
                : 'text-[#77786F] hover:text-[#30352F]'
            }`}
          >
            Upcoming Visits ({upcomingApts.length})
          </button>
          <button
            onClick={() => setTab('past')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              tab === 'past'
                ? 'bg-[#E6F1E8] text-[#30352F] shadow-xs'
                : 'text-[#77786F] hover:text-[#30352F]'
            }`}
          >
            Past Consultations ({pastApts.length})
          </button>
        </div>

        {role !== 'elderly' && (
          <button
            onClick={() => {
              setAppointmentToEdit(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Appointment</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#77786F] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by doctor, clinic, specialty or purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#EAE9E2] text-[#30352F] placeholder-[#77786F] shadow-xs focus:outline-none focus:border-[#789B7D]"
        />
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredList.length === 0 ? (
          <div className="saathi-card p-10 text-center bg-white">
            <span className="text-3xl block mb-2">🩺</span>
            <p className="text-sm font-semibold text-[#30352F]">
              No {tab} appointments found
            </p>
            <p className="text-xs text-[#77786F] mt-1">
              {tab === 'upcoming'
                ? 'All checkups are up to date! Click "Schedule Appointment" to book.'
                : 'Past appointment records will appear here after consultations.'}
            </p>
          </div>
        ) : (
          filteredList.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* Modal */}
      <AddAppointmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAppointmentToEdit(undefined);
        }}
        appointmentToEdit={appointmentToEdit}
      />
    </div>
  );
};
