import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../storageService';
import { medicationService } from '../medicationService';
import { appointmentService } from '../appointmentService';
import { careCircleService } from '../careCircleService';
import { notificationService } from '../notificationService';
import { activityService } from '../activityService';

describe('SaathiCare Core Services & Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.reset();
  });

  describe('StorageService', () => {
    it('seeds initial data on first launch', () => {
      const data = storageService.get();
      expect(data.version).toBe(1);
      expect(data.profile.name).toBe('Meera Patel');
      expect(data.medications.length).toBeGreaterThanOrEqual(4);
      expect(data.doses.length).toBeGreaterThanOrEqual(4);
    });

    it('recovers gracefully from corrupted LocalStorage data', () => {
      localStorage.setItem('saathicare_app_data_v1', '{corrupted json content');
      const recovered = storageService.get();
      expect(recovered).toBeDefined();
      expect(recovered.profile.name).toBe('Meera Patel');
    });

    it('resets cleanly to initial state on reset()', () => {
      // Modify data
      storageService.update((d) => ({ ...d, profile: { ...d.profile, name: 'Changed' } }));
      expect(storageService.get().profile.name).toBe('Changed');

      // Reset
      storageService.reset();
      expect(storageService.get().profile.name).toBe('Meera Patel');
    });
  });

  describe('MedicationService', () => {
    it('creates a new medication and schedules a dose for today', () => {
      const newMed = medicationService.create(
        {
          name: 'CoQ10 Supplement',
          dosage: '100 mg',
          frequency: 'Once daily',
          reminderTimes: ['10:00 AM'],
          instructions: 'Take with morning meal',
          startDate: '2026-11-15',
          purpose: 'Cardiovascular energy',
          timeOfDay: 'morning',
          status: 'active',
          prescribedBy: 'Dr. Rajesh Sharma',
          colorTag: 'sage',
        },
        'Aarav Patel',
        'family'
      );

      expect(newMed.id).toBeDefined();
      const allMeds = medicationService.getAll();
      expect(allMeds.some((m) => m.name === 'CoQ10 Supplement')).toBe(true);

      const todayDoses = medicationService.getTodayDoses();
      expect(todayDoses.some((d) => d.medicationName === 'CoQ10 Supplement')).toBe(true);
    });

    it('confirms a dose as taken and updates adherence metrics', () => {
      const todayDoses = medicationService.getTodayDoses();
      const upcoming = todayDoses.find((d) => d.status === 'upcoming');
      expect(upcoming).toBeDefined();

      const confirmed = medicationService.confirmDose(
        upcoming!.id,
        'taken',
        'Meera Patel',
        'elderly'
      );
      expect(confirmed?.status).toBe('taken');
      expect(confirmed?.actionBy).toBe('Meera Patel');

      const metrics = medicationService.getAdherenceMetrics();
      expect(metrics.todayProgress.taken).toBeGreaterThanOrEqual(2);
    });

    it('allows undoing a dose back to upcoming without accidental duplication', () => {
      const todayDoses = medicationService.getTodayDoses();
      const dose = todayDoses[0];

      medicationService.confirmDose(dose.id, 'taken', 'Meera Patel', 'elderly');
      let current = medicationService.getAllDoses().find((d) => d.id === dose.id);
      expect(current?.status).toBe('taken');

      medicationService.confirmDose(dose.id, 'upcoming', 'Meera Patel', 'elderly');
      current = medicationService.getAllDoses().find((d) => d.id === dose.id);
      expect(current?.status).toBe('upcoming');
      expect(current?.actionTimestamp).toBeUndefined();
    });

    it('deletes a medication and removes associated doses from schedule', () => {
      const med = medicationService.getAll()[0];
      const medId = med.id;

      medicationService.delete(medId, 'Aarav Patel', 'family');
      expect(medicationService.getById(medId)).toBeUndefined();
      expect(medicationService.getAllDoses().some((d) => d.medicationId === medId)).toBe(false);
    });
  });

  describe('AppointmentService', () => {
    it('creates and retrieves upcoming appointments', () => {
      const apt = appointmentService.create(
        {
          doctorName: 'Dr. Priya Nambiar',
          specialty: 'Neurologist',
          hospital: 'Columbia Asia Hospital',
          date: '2026-11-28',
          time: '03:00 PM',
          purpose: 'Cognitive health check',
          contact: '+91 98450 77665',
          status: 'upcoming',
        },
        'Aarav Patel',
        'family'
      );

      expect(apt.id).toBeDefined();
      const upcoming = appointmentService.getUpcoming();
      expect(upcoming.some((a) => a.doctorName === 'Dr. Priya Nambiar')).toBe(true);
    });

    it('cancels an appointment without deleting record', () => {
      const apt = appointmentService.getUpcoming()[0];
      appointmentService.cancel(apt.id, 'Aarav Patel', 'family');

      const all = appointmentService.getAll();
      const target = all.find((a) => a.id === apt.id);
      expect(target?.status).toBe('cancelled');
    });

    it('permanently deletes an appointment', () => {
      const apt = appointmentService.getAll()[0];
      appointmentService.delete(apt.id, 'Aarav Patel', 'family');
      expect(appointmentService.getAll().some((a) => a.id === apt.id)).toBe(false);
    });
  });

  describe('CareCircleService', () => {
    it('generates a 6-digit invitation code', () => {
      const code = careCircleService.generateInviteCode('caretaker', 'Aarav Patel', 'family');
      expect(code).toMatch(/^\d{6}$/);

      const activeCodes = careCircleService.getInviteCodes();
      expect(activeCodes.some((inv) => inv.code === code)).toBe(true);
    });

    it('allows a new member to join with valid code and removes used code', () => {
      const code = careCircleService.generateInviteCode('family', 'Meera Patel', 'elderly');
      const res = careCircleService.joinWithCode({
        code,
        name: 'Sunita Sharma',
        relation: 'Niece',
        phone: '+91 98111 44556',
        email: 'sunita@example.com',
      });

      expect(res.success).toBe(true);
      expect(res.member?.name).toBe('Sunita Sharma');

      const members = careCircleService.getAll();
      expect(members.some((m) => m.name === 'Sunita Sharma')).toBe(true);

      // Code should be used and consumed
      const activeCodes = careCircleService.getInviteCodes();
      expect(activeCodes.some((inv) => inv.code === code)).toBe(false);
    });

    it('prevents removing primary care circle members', () => {
      const members = careCircleService.getAll();
      const primary = members.find((m) => m.isPrimary);
      expect(primary).toBeDefined();

      careCircleService.removeMember(primary!.id, 'Aarav Patel', 'family');
      expect(careCircleService.getAll().some((m) => m.id === primary!.id)).toBe(true);
    });
  });

  describe('NotificationService & Missed Dose Escalation', () => {
    it('creates notification and allows toggling read state', () => {
      const notif = notificationService.create({
        title: 'Water Reminder',
        message: 'Drink 250ml water',
        category: 'care_circle',
        priority: 'normal',
      });

      expect(notif.read).toBe(false);
      notificationService.toggleRead(notif.id);
      expect(notificationService.getAll().find((n) => n.id === notif.id)?.read).toBe(true);

      notificationService.toggleRead(notif.id);
      expect(notificationService.getAll().find((n) => n.id === notif.id)?.read).toBe(false);
    });

    it('executes smart missed dose escalation with multi-tiered notifications and activity logging', () => {
      const result = notificationService.simulateMissedDose('Metformin XR (500 mg)', '09:00 AM');
      expect(result.escalated).toBe(true);
      expect(result.notificationsCreated.length).toBe(3);

      const notifs = notificationService.getAll();
      expect(notifs.some((n) => n.priority === 'escalation')).toBe(true);
      expect(notifs.some((n) => n.targetRole === 'caretaker')).toBe(true);

      const logs = activityService.getAll();
      expect(logs.some((l) => l.action.includes('Missed Dose Escalation'))).toBe(true);
    });
  });
});
