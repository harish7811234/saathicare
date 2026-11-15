import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  History,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { medicationService } from '../services/medicationService';
import { Medication } from '../types';
import { MedicationCard } from '../components/medications/MedicationCard';
import { MedicationDoseCard } from '../components/medications/MedicationDoseCard';
import { AddMedicationModal } from '../components/medications/AddMedicationModal';

export const MedicationsPage: React.FC = () => {
  const { role, data } = useApp();
  const [activeTab, setActiveTab] = useState<'today' | 'prescriptions' | 'history'>('today');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [medicationToEdit, setMedicationToEdit] = useState<Medication | undefined>(undefined);

  const allMeds = data.medications || [];
  const todayDoses = medicationService.getTodayDoses();
  const allDoses = medicationService.getAllDoses();

  // Filter today's doses
  const filteredTodayDoses = todayDoses.filter((dose) => {
    const matchesFilter = selectedTimeFilter === 'all' || dose.timeOfDay === selectedTimeFilter;
    const matchesSearch =
      dose.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dose.dosage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filter prescriptions
  const filteredMeds = allMeds.filter((med) => {
    const matchesFilter = selectedTimeFilter === 'all' || med.timeOfDay === selectedTimeFilter;
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filter history doses
  const filteredHistoryDoses = allDoses
    .filter((d) => d.status === 'taken' || d.status === 'skipped' || d.status === 'missed')
    .slice(0, 20);

  const handleEditMed = (med: Medication) => {
    setMedicationToEdit(med);
    setIsAddModalOpen(true);
  };

  const isElderly = role === 'elderly';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#EAE9E2] shadow-xs w-fit">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'today'
                ? 'bg-[#E6F1E8] text-[#30352F] shadow-xs'
                : 'text-[#77786F] hover:text-[#30352F]'
            }`}
          >
            Today's Routine ({todayDoses.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'prescriptions'
                ? 'bg-[#E6F1E8] text-[#30352F] shadow-xs'
                : 'text-[#77786F] hover:text-[#30352F]'
            }`}
          >
            All Prescriptions ({allMeds.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-[#E6F1E8] text-[#30352F] shadow-xs'
                : 'text-[#77786F] hover:text-[#30352F]'
            }`}
          >
            Dose History
          </button>
        </div>

        {/* Action: Add Medicine */}
        {role !== 'elderly' && (
          <button
            onClick={() => {
              setMedicationToEdit(undefined);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#789B7D] hover:bg-[#698B6E] text-white text-xs font-semibold shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Prescription</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-[#EAE9E2] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#77786F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by medication name, dosage or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-[#FAF8F2] border border-[#EAE9E2] text-[#30352F] placeholder-[#77786F] focus:outline-none focus:border-[#789B7D]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-[#77786F] px-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Period:
          </span>
          {(['all', 'morning', 'afternoon', 'evening', 'night'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedTimeFilter(period)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium capitalize transition-all ${
                selectedTimeFilter === period
                  ? 'bg-[#30352F] text-white font-semibold'
                  : 'bg-[#FAF8F2] text-[#77786F] hover:text-[#30352F] border border-[#EAE9E2]'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Today's Schedule */}
      {activeTab === 'today' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#30352F] tracking-tight">
              {isElderly ? "Your Doses for Today" : "Today's Scheduled Medication Administration"}
            </h3>
            <span className="text-xs text-[#77786F]">
              {filteredTodayDoses.filter((d) => d.status === 'taken').length} of {filteredTodayDoses.length} confirmed
            </span>
          </div>

          {filteredTodayDoses.length === 0 ? (
            <div className="saathi-card p-10 text-center bg-white">
              <span className="text-3xl block mb-2">💊</span>
              <p className="text-sm font-semibold text-[#30352F]">No matching medications found</p>
              <p className="text-xs text-[#77786F] mt-1">Try clearing filters or search query.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodayDoses.map((dose) => (
                <MedicationDoseCard
                  key={dose.id}
                  dose={dose}
                  isElderlyMode={isElderly}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: All Prescriptions Catalog */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#30352F] tracking-tight">
              Active Prescriptions & Regimens ({filteredMeds.length})
            </h3>
            {role === 'elderly' && (
              <span className="text-xs text-[#77786F]">
                Managed by Dr. Rajesh Sharma & Aarav Patel
              </span>
            )}
          </div>

          {filteredMeds.length === 0 ? (
            <div className="saathi-card p-10 text-center bg-white">
              <span className="text-3xl block mb-2">📋</span>
              <p className="text-sm font-semibold text-[#30352F]">No prescriptions match your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeds.map((med) => (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  onEdit={handleEditMed}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Dose History Log */}
      {activeTab === 'history' && (
        <div className="saathi-card p-6 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#30352F] tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-[#789B7D]" />
              <span>Recorded Dose History (Past 7 Days)</span>
            </h3>
            <span className="text-xs text-[#77786F]">Chronologically logged</span>
          </div>

          <div className="divide-y divide-[#EAE9E2]">
            {filteredHistoryDoses.map((dose) => (
              <div key={dose.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {dose.status === 'taken' ? '✅' : dose.status === 'skipped' ? '⏭️' : '⚠️'}
                  </span>
                  <div>
                    <span className="font-semibold text-[#30352F] block">
                      {dose.medicationName} ({dose.dosage})
                    </span>
                    <span className="text-[11px] text-[#77786F]">
                      Date: {dose.scheduledDate} • Scheduled {dose.scheduledTime}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      dose.status === 'taken'
                        ? 'bg-[#E6F1E8] text-[#587A5D]'
                        : dose.status === 'skipped'
                        ? 'bg-[#FCE8D8] text-[#B86234]'
                        : 'bg-[#FAD8D8] text-[#D95C5C]'
                    }`}
                  >
                    {dose.status}
                  </span>
                  {dose.actionBy && (
                    <span className="text-[10px] text-[#77786F] block mt-0.5">
                      by {dose.actionBy}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setMedicationToEdit(undefined);
        }}
        medicationToEdit={medicationToEdit}
      />
    </div>
  );
};
