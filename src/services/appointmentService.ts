import { Appointment, Role } from '../types';
import { storageService } from './storageService';
import { activityService } from './activityService';
import { notificationService } from './notificationService';

export const appointmentService = {
  getAll(): Appointment[] {
    return storageService.get().appointments || [];
  },

  getUpcoming(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll()
      .filter((a) => a.status === 'upcoming' && a.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  getPast(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getAll()
      .filter((a) => a.status === 'completed' || a.date < today)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  create(apt: Omit<Appointment, 'id'>, actorName: string, actorRole: Role): Appointment {
    const id = `apt-${Date.now()}`;
    const newApt: Appointment = { ...apt, id };

    storageService.update((data) => ({
      ...data,
      appointments: [newApt, ...(data.appointments || [])],
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Scheduled Doctor Appointment',
      details: `${newApt.doctorName} (${newApt.specialty}) on ${newApt.date} at ${newApt.time}`,
      type: 'appointment',
    });

    notificationService.create({
      title: 'New Appointment Scheduled',
      message: `Appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.time} added by ${actorName}.`,
      category: 'appointment',
      targetRole: 'all',
    });

    return newApt;
  },

  update(apt: Appointment, actorName: string, actorRole: Role): Appointment {
    storageService.update((data) => ({
      ...data,
      appointments: data.appointments.map((a) => (a.id === apt.id ? apt : a)),
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Updated Appointment',
      details: `Rescheduled ${apt.doctorName} to ${apt.date} at ${apt.time}`,
      type: 'appointment',
    });

    return apt;
  },

  cancel(id: string, actorName: string, actorRole: Role): void {
    const apt = this.getAll().find((a) => a.id === id);
    if (!apt) return;

    storageService.update((data) => ({
      ...data,
      appointments: data.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      ),
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Cancelled Appointment',
      details: `Cancelled appointment with ${apt.doctorName}`,
      type: 'appointment',
    });

    notificationService.create({
      title: 'Appointment Cancelled',
      message: `Appointment with ${apt.doctorName} was cancelled by ${actorName}.`,
      category: 'appointment',
      priority: 'urgent',
      targetRole: 'all',
    });
  },

  delete(id: string, actorName: string, actorRole: Role): void {
    const apt = this.getAll().find((a) => a.id === id);
    const doctorName = apt?.doctorName || 'Doctor';

    storageService.update((data) => ({
      ...data,
      appointments: data.appointments.filter((a) => a.id !== id),
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Deleted Appointment',
      details: `Removed appointment entry for ${doctorName}`,
      type: 'appointment',
    });
  },
};
