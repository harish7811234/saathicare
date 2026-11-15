export type Role = 'elderly' | 'family' | 'caretaker';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
  relation?: string;
  phone?: string;
}

export interface ElderlyProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  primaryPhysician: {
    name: string;
    specialty: string;
    clinic: string;
    phone: string;
  };
  conditions: string[];
  allergies: string[];
  vitals: {
    bloodPressure: string;
    bloodSugar: string;
    pulse: string;
    weight: string;
    lastUpdated: string;
  };
  avatar: string;
  preferredLanguage: string;
}

export interface CareMember {
  id: string;
  name: string;
  role: Role;
  relation: string;
  phone: string;
  email: string;
  status: 'active' | 'pending' | 'invited';
  responsibilities: string[];
  avatar: string;
  joinedDate: string;
  isPrimary?: boolean;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminderTimes: string[];
  instructions: string;
  startDate: string;
  endDate?: string;
  purpose: string;
  timeOfDay: TimeOfDay;
  status: 'active' | 'completed' | 'paused';
  prescribedBy: string;
  colorTag: 'sage' | 'peach' | 'lavender' | 'yellow';
}

export type DoseStatus = 'upcoming' | 'taken' | 'skipped' | 'missed' | 'unconfirmed';

export interface MedicationDose {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  timeOfDay: TimeOfDay;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // e.g. "09:00 AM"
  status: DoseStatus;
  actionTimestamp?: string;
  actionBy?: string;
  notes?: string;
  colorTag: 'sage' | 'peach' | 'lavender' | 'yellow';
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  date: string;
  time: string;
  purpose: string;
  contact: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  accompaniedBy?: string;
}

export type NotificationCategory = 'medication' | 'missed_dose' | 'appointment' | 'care_circle' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: 'normal' | 'urgent' | 'escalation';
  timestamp: string;
  read: boolean;
  targetRole?: Role | 'all';
  actionUrl?: string;
  isSimulated?: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: Role | 'system';
  action: string;
  details: string;
  type: 'medication' | 'appointment' | 'circle' | 'alert' | 'profile';
}

export interface StorageData {
  version: number;
  profile: ElderlyProfile;
  medications: Medication[];
  doses: MedicationDose[];
  appointments: Appointment[];
  careCircle: CareMember[];
  notifications: Notification[];
  activities: ActivityLog[];
  inviteCodes: Array<{ code: string; role: Role; createdAt: string; expiresAt: string }>;
  settings: {
    notificationsEnabled: boolean;
    missedDoseEscalationMinutes: number;
    largeTextElderlyMode: boolean;
    audioChimesEnabled: boolean;
  };
}
