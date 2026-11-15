import { Medication, MedicationDose, DoseStatus, Role, TimeOfDay } from '../types';
import { storageService } from './storageService';
import { activityService } from './activityService';
import { notificationService } from './notificationService';

export const medicationService = {
  getAll(): Medication[] {
    return storageService.get().medications || [];
  },

  getById(id: string): Medication | undefined {
    return this.getAll().find((m) => m.id === id);
  },

  create(med: Omit<Medication, 'id'>, actorName: string, actorRole: Role): Medication {
    const id = `med-${Date.now()}`;
    const newMed: Medication = { ...med, id };

    storageService.update((data) => {
      // Also generate a dose for today if applicable
      const todayStr = new Date().toISOString().split('T')[0];
      const newDose: MedicationDose = {
        id: `dose-${todayStr}-${id}`,
        medicationId: id,
        medicationName: newMed.name,
        dosage: newMed.dosage,
        instructions: newMed.instructions,
        timeOfDay: newMed.timeOfDay,
        scheduledDate: todayStr,
        scheduledTime: newMed.reminderTimes[0] || '09:00 AM',
        status: 'upcoming',
        colorTag: newMed.colorTag,
      };

      return {
        ...data,
        medications: [...(data.medications || []), newMed],
        doses: [newDose, ...(data.doses || [])],
      };
    });

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Added New Medication',
      details: `${newMed.name} (${newMed.dosage}) - ${newMed.frequency}`,
      type: 'medication',
    });

    notificationService.create({
      title: 'New Medication Added',
      message: `${newMed.name} (${newMed.dosage}) added to daily schedule by ${actorName}.`,
      category: 'medication',
      targetRole: 'all',
    });

    return newMed;
  },

  update(med: Medication, actorName: string, actorRole: Role): Medication {
    storageService.update((data) => ({
      ...data,
      medications: data.medications.map((m) => (m.id === med.id ? med : m)),
      doses: data.doses.map((d) =>
        d.medicationId === med.id
          ? {
              ...d,
              medicationName: med.name,
              dosage: med.dosage,
              instructions: med.instructions,
              timeOfDay: med.timeOfDay,
              colorTag: med.colorTag,
            }
          : d
      ),
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Updated Medication Details',
      details: `Modified ${med.name} (${med.dosage})`,
      type: 'medication',
    });

    return med;
  },

  delete(id: string, actorName: string, actorRole: Role): void {
    const med = this.getById(id);
    const medName = med?.name || 'Medication';

    storageService.update((data) => ({
      ...data,
      medications: data.medications.filter((m) => m.id !== id),
      doses: data.doses.filter((d) => d.medicationId !== id),
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Removed Medication',
      details: `Discontinued ${medName}`,
      type: 'medication',
    });

    notificationService.create({
      title: 'Medication Removed',
      message: `${medName} has been removed from the schedule by ${actorName}.`,
      category: 'medication',
      targetRole: 'all',
    });
  },

  getTodayDoses(): MedicationDose[] {
    const todayStr = new Date().toISOString().split('T')[0];
    const allDoses = storageService.get().doses || [];
    return allDoses.filter((d) => d.scheduledDate === todayStr);
  },

  getAllDoses(): MedicationDose[] {
    return storageService.get().doses || [];
  },

  confirmDose(
    doseId: string,
    action: 'taken' | 'skipped' | 'upcoming',
    actorName: string,
    actorRole: Role
  ): MedicationDose | undefined {
    let updatedDose: MedicationDose | undefined;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    storageService.update((data) => {
      const doses = data.doses.map((dose) => {
        if (dose.id === doseId) {
          updatedDose = {
            ...dose,
            status: action,
            actionTimestamp: action === 'upcoming' ? undefined : timeStr,
            actionBy: action === 'upcoming' ? undefined : actorName,
          };
          return updatedDose;
        }
        return dose;
      });
      return { ...data, doses };
    });

    if (updatedDose && action !== 'upcoming') {
      const actionText = action === 'taken' ? 'Confirmed Taken' : 'Marked Skipped';
      activityService.log({
        actor: actorName,
        actorRole,
        action: actionText,
        details: `${updatedDose.medicationName} (${updatedDose.dosage}) at ${timeStr}`,
        type: 'medication',
      });

      if (action === 'taken') {
        notificationService.create({
          title: 'Dose Confirmed',
          message: `${actorName} confirmed taking ${updatedDose.medicationName} (${updatedDose.dosage}).`,
          category: 'medication',
          priority: 'normal',
          targetRole: 'all',
        });
      } else {
        notificationService.create({
          title: 'Dose Skipped',
          message: `${updatedDose.medicationName} was marked skipped by ${actorName}.`,
          category: 'medication',
          priority: 'urgent',
          targetRole: 'all',
        });
      }
    } else if (updatedDose && action === 'upcoming') {
      activityService.log({
        actor: actorName,
        actorRole,
        action: 'Reset Dose Status',
        details: `Reset ${updatedDose.medicationName} status to scheduled`,
        type: 'medication',
      });
    }

    return updatedDose;
  },

  getAdherenceMetrics(): {
    overallRate: number;
    totalDoses: number;
    takenDoses: number;
    skippedDoses: number;
    missedDoses: number;
    todayProgress: {
      total: number;
      taken: number;
      pending: number;
      percentage: number;
    };
    nextReminder: MedicationDose | null;
    dailyHistory: Array<{
      day: string;
      date: string;
      taken: number;
      total: number;
      rate: number;
    }>;
  } {
    const doses = storageService.get().doses || [];
    const todayStr = new Date().toISOString().split('T')[0];

    // Today's doses
    const todayDoses = doses.filter((d) => d.scheduledDate === todayStr);
    const todayTaken = todayDoses.filter((d) => d.status === 'taken').length;
    const todayTotal = todayDoses.length;
    const todayPending = todayDoses.filter((d) => d.status === 'upcoming' || d.status === 'unconfirmed').length;
    const todayPercentage = todayTotal > 0 ? Math.round((todayTaken / todayTotal) * 100) : 0;

    // Next upcoming dose today
    const nextReminder =
      todayDoses.find((d) => d.status === 'upcoming' || d.status === 'unconfirmed') || null;

    // Past 7 days calculation
    const dailyHistory: Array<{
      day: string;
      date: string;
      taken: number;
      total: number;
      rate: number;
    }> = [];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let totalDoses7Days = 0;
    let takenDoses7Days = 0;
    let skippedDoses7Days = 0;
    let missedDoses7Days = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      const dayDoses = doses.filter((dose) => dose.scheduledDate === dateStr);
      const taken = dayDoses.filter((dose) => dose.status === 'taken').length;
      const skipped = dayDoses.filter((dose) => dose.status === 'skipped').length;
      const missed = dayDoses.filter((dose) => dose.status === 'missed').length;
      const total = dayDoses.length;

      totalDoses7Days += total;
      takenDoses7Days += taken;
      skippedDoses7Days += skipped;
      missedDoses7Days += missed;

      const rate = total > 0 ? Math.round((taken / total) * 100) : (i === 0 ? todayPercentage : 100);

      dailyHistory.push({
        day: i === 0 ? 'Today' : dayName,
        date: dateStr,
        taken,
        total,
        rate,
      });
    }

    const overallRate =
      totalDoses7Days > 0 ? Math.round((takenDoses7Days / totalDoses7Days) * 100) : 88;

    return {
      overallRate,
      totalDoses: totalDoses7Days,
      takenDoses: takenDoses7Days,
      skippedDoses: skippedDoses7Days,
      missedDoses: missedDoses7Days,
      todayProgress: {
        total: todayTotal,
        taken: todayTaken,
        pending: todayPending,
        percentage: todayPercentage,
      },
      nextReminder,
      dailyHistory,
    };
  },
};
