import { Notification, NotificationCategory, Role } from '../types';
import { storageService } from './storageService';
import { activityService } from './activityService';

export const notificationService = {
  getAll(): Notification[] {
    return storageService.get().notifications || [];
  },

  getUnreadCount(): number {
    return this.getAll().filter((n) => !n.read).length;
  },

  markAsRead(id: string): void {
    storageService.update((data) => ({
      ...data,
      notifications: data.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },

  toggleRead(id: string): void {
    storageService.update((data) => ({
      ...data,
      notifications: data.notifications.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      ),
    }));
  },

  markAllAsRead(): void {
    storageService.update((data) => ({
      ...data,
      notifications: data.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  create(params: {
    title: string;
    message: string;
    category: NotificationCategory;
    priority?: 'normal' | 'urgent' | 'escalation';
    targetRole?: Role | 'all';
    isSimulated?: boolean;
  }): Notification {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: params.title,
      message: params.message,
      category: params.category,
      priority: params.priority || 'normal',
      timestamp: `Today, ${timeStr}`,
      read: false,
      targetRole: params.targetRole || 'all',
      isSimulated: params.isSimulated ?? false,
    };

    storageService.update((data) => ({
      ...data,
      notifications: [newNotif, ...(data.notifications || [])],
    }));

    return newNotif;
  },

  simulateMissedDose(
    medicationName: string = 'Metformin XR (500 mg)',
    scheduledTime: string = '09:00 AM'
  ): {
    notificationsCreated: Notification[];
    escalated: boolean;
  } {
    // 1. Mark matching dose as missed in storage
    const today = new Date().toISOString().split('T')[0];

    storageService.update((data) => {
      const doses = data.doses.map((dose) => {
        if (dose.scheduledDate === today && dose.medicationName.includes('Metformin') && dose.status !== 'taken') {
          return {
            ...dose,
            status: 'missed' as const,
            notes: 'Unconfirmed after scheduled reminder time window (Simulated Escalation)',
          };
        }
        return dose;
      });
      return { ...data, doses };
    });

    // 2. Step 1: Follow-up alert for Elderly user
    const n1 = this.create({
      title: '⚠️ Missed Dose Reminder (Demo)',
      message: `${medicationName} scheduled for ${scheduledTime} was not confirmed. Please take it or mark as skipped.`,
      category: 'missed_dose',
      priority: 'urgent',
      targetRole: 'elderly',
      isSimulated: true,
    });

    // 3. Step 2: Caretaker Notification
    const n2 = this.create({
      title: '🚨 Caretaker Alert: Unconfirmed Dose (Demo)',
      message: `Meera Patel has not confirmed morning ${medicationName}. Priya Shah (Caretaker) prompted for in-person check.`,
      category: 'missed_dose',
      priority: 'urgent',
      targetRole: 'caretaker',
      isSimulated: true,
    });

    // 4. Step 3: Family Escalation Alert
    const n3 = this.create({
      title: '⚡ Family Escalation: Medication Window Lapsed (Demo)',
      message: `Escalated to Aarav Patel (Son): ${medicationName} at ${scheduledTime} remains unconfirmed. Caretaker notified.`,
      category: 'missed_dose',
      priority: 'escalation',
      targetRole: 'family',
      isSimulated: true,
    });

    // 5. Record in Activity Timeline
    activityService.log({
      actor: 'Smart Care Monitor',
      actorRole: 'system',
      action: 'Simulated Missed Dose Escalation',
      details: `${medicationName} at ${scheduledTime} was unconfirmed. Escalated to Caretaker Priya and Family Aarav.`,
      type: 'alert',
    });

    return {
      notificationsCreated: [n1, n2, n3],
      escalated: true,
    };
  },
};
