import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../storageService';
import { appointmentService } from '../appointmentService';
import { careCircleService } from '../careCircleService';
import { notificationService } from '../notificationService';
import { activityService } from '../activityService';
import { profileService } from '../profileService';

describe('Comprehensive Core Healthcare Operations Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.reset();
  });

  describe('Appointment Service Operations', () => {
    it('creates an appointment and lists it in upcoming appointments', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const apt = appointmentService.create(
        {
          doctorName: 'Dr. Sunita Rao',
          specialty: 'Ophthalmologist',
          hospital: 'Surat Eye Hospital',
          date: tomorrowStr,
          time: '11:00 AM',
          purpose: 'Annual cataract checkup',
          contact: '+91 98250 99881',
          status: 'upcoming',
        },
        'Aarav Patel',
        'family'
      );

      expect(apt.id).toBeDefined();
      expect(apt.doctorName).toBe('Dr. Sunita Rao');

      const upcoming = appointmentService.getUpcoming();
      expect(upcoming.some((a) => a.id === apt.id)).toBe(true);
    });

    it('cancels an upcoming appointment and updates status', () => {
      const upcoming = appointmentService.getUpcoming();
      expect(upcoming.length).toBeGreaterThan(0);
      const target = upcoming[0];

      appointmentService.cancel(target.id, 'Aarav Patel', 'family');
      const all = appointmentService.getAll();
      const updated = all.find((a) => a.id === target.id);
      expect(updated?.status).toBe('cancelled');

      const updatedUpcoming = appointmentService.getUpcoming();
      expect(updatedUpcoming.some((a) => a.id === target.id)).toBe(false);
    });

    it('permanently deletes an appointment record', () => {
      const all = storageService.get().appointments;
      const target = all[0];
      const initialCount = all.length;

      appointmentService.delete(target.id, 'Aarav Patel', 'family');

      const afterDelete = storageService.get().appointments;
      expect(afterDelete.length).toBe(initialCount - 1);
      expect(afterDelete.some((a) => a.id === target.id)).toBe(false);
    });

    it('updates an existing appointment details', () => {
      const upcoming = appointmentService.getUpcoming();
      const target = upcoming[0];

      const updated = appointmentService.update(
        {
          ...target,
          time: '04:30 PM',
          purpose: 'Updated Consultation Reason',
        },
        'Aarav Patel',
        'family'
      );

      expect(updated.time).toBe('04:30 PM');
      expect(updated.purpose).toBe('Updated Consultation Reason');
    });
  });

  describe('Care Circle Collaboration & Invite Codes', () => {
    it('generates a 6-digit cryptographic invite code', () => {
      const code = careCircleService.generateInviteCode('caretaker', 'Aarav Patel', 'family');
      expect(code).toBeDefined();
      expect(code.length).toBe(6);
      expect(/^\d{6}$/.test(code)).toBe(true);

      const data = storageService.get();
      expect(data.inviteCodes.some((c) => c.code === code)).toBe(true);
    });

    it('allows a new caretaker to join using a valid invite code', () => {
      const code = careCircleService.generateInviteCode('caretaker', 'Aarav Patel', 'family');

      const result = careCircleService.joinWithCode({
        code,
        name: 'Rohan Verma',
        relation: 'Evening Nurse',
        phone: '+91 98765 00000',
        email: 'rohan.verma@eldercare.in',
      });

      expect(result.success).toBe(true);
      expect(result.member).toBeDefined();
      expect(result.member?.name).toBe('Rohan Verma');
      expect(result.member?.role).toBe('caretaker');

      // Check member added to store
      const members = careCircleService.getAll();
      expect(members.some((m) => m.name === 'Rohan Verma')).toBe(true);
    });

    it('rejects joining with an invalid or expired invite code', () => {
      const result = careCircleService.joinWithCode({
        code: '999999',
        name: 'Fake User',
        relation: 'Unknown',
        phone: '+91 98765 11111',
        email: 'fake@example.com',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    it('removes a member from the care circle', () => {
      const members = careCircleService.getAll();
      const nonPrimary = members.find((m) => !m.isPrimary);
      expect(nonPrimary).toBeDefined();

      if (nonPrimary) {
        careCircleService.removeMember(nonPrimary.id, 'Aarav Patel', 'family');
        expect(careCircleService.getAll().some((m) => m.id === nonPrimary.id)).toBe(false);
      }
    });
  });

  describe('Notification Centre & Escalation Engine', () => {
    it('counts unread notifications accurately', () => {
      const count = notificationService.getUnreadCount();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it('creates an urgent escalation notification and marks it as unread', () => {
      const initialCount = notificationService.getUnreadCount();

      const notif = notificationService.create({
        title: 'URGENT: Blood Pressure Alert',
        message: 'Morning BP reading measured at 155/95 mmHg. Physician notified.',
        category: 'system',
        priority: 'escalation',
        targetRole: 'all',
      });

      expect(notif.id).toBeDefined();
      expect(notif.read).toBe(false);
      expect(notificationService.getUnreadCount()).toBe(initialCount + 1);
    });

    it('marks a single notification as read', () => {
      const notifs = notificationService.getAll();
      const target = notifs[0];

      notificationService.markAsRead(target.id);
      const updatedNotifs = notificationService.getAll();
      const updated = updatedNotifs.find((n) => n.id === target.id);
      expect(updated?.read).toBe(true);
    });

    it('marks all notifications as read', () => {
      notificationService.create({
        title: 'Unread 1',
        message: 'msg 1',
        category: 'medication',
        priority: 'normal',
      });
      notificationService.create({
        title: 'Unread 2',
        message: 'msg 2',
        category: 'appointment',
        priority: 'normal',
      });

      notificationService.markAllAsRead();
      expect(notificationService.getUnreadCount()).toBe(0);
    });
  });

  describe('Activity Logging & Timeline', () => {
    it('logs an audit activity with timestamp and actor', () => {
      const initialActivities = activityService.getAll().length;

      activityService.log({
        actor: 'Priya Shah',
        actorRole: 'caretaker',
        action: 'Administered Shelcal 500',
        details: 'Dose taken with warm milk post lunch.',
        type: 'medication',
      });

      const updated = activityService.getAll();
      expect(updated.length).toBe(initialActivities + 1);
      expect(updated[0].actor).toBe('Priya Shah');
      expect(updated[0].type).toBe('medication');
    });
  });

  describe('Health Profile & Vitals Management', () => {
    it('updates vitals records and reflects in storage', () => {
      const newVitals = {
        bloodPressure: '120/80 mmHg',
        bloodSugar: '110 mg/dL',
        pulse: '72 bpm',
        weight: '62 kg',
        lastUpdated: 'Today at 07:30 AM',
      };

      const updatedVitals = profileService.updateVitals(newVitals, 'Priya Shah', 'caretaker');
      expect(updatedVitals.bloodPressure).toBe('120/80 mmHg');
      expect(updatedVitals.bloodSugar).toBe('110 mg/dL');

      const stored = profileService.get();
      expect(stored.vitals.bloodPressure).toBe('120/80 mmHg');
    });

    it('updates health profile safely', () => {
      const current = profileService.get();
      const updated = profileService.update(
        {
          ...current,
          conditions: ['Hypertension (Stage 1)', 'Type 2 Diabetes', 'Mild Osteoarthritis'],
          allergies: ['Penicillin', 'Sulfa Drugs'],
        },
        'Aarav Patel',
        'family'
      );

      expect(updated.conditions.length).toBe(3);
      expect(updated.allergies).toContain('Sulfa Drugs');
    });
  });
});
