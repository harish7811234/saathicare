import { StorageData, Medication, MedicationDose, Appointment, CareMember, Notification, ActivityLog, ElderlyProfile } from '../types';

export const initialProfile: ElderlyProfile = {
  id: 'meera-patel-01',
  name: 'Meera Patel',
  age: 72,
  gender: 'Female',
  bloodGroup: 'B+',
  address: 'B-402, Green Glen Gardens, Bellandur, Bengaluru',
  emergencyContact: {
    name: 'Aarav Patel',
    relation: 'Son',
    phone: '+91 98450 12345',
  },
  primaryPhysician: {
    name: 'Dr. Rajesh Sharma',
    specialty: 'Senior Cardiologist',
    clinic: 'Max Heart & Vascular Clinic',
    phone: '+91 98200 87654',
  },
  conditions: ['Hypertension (Stage 1)', 'Type 2 Diabetes (Managed)', 'Mild Osteoarthritis'],
  allergies: ['Penicillin', 'Sulfa Antibiotics'],
  vitals: {
    bloodPressure: '124/82 mmHg',
    bloodSugar: '118 mg/dL (Fasting)',
    pulse: '74 bpm',
    weight: '62.4 kg',
    lastUpdated: 'Today, 8:15 AM',
  },
  avatar: '👵',
  preferredLanguage: 'English & Hindi',
};

export const initialMedications: Medication[] = [
  {
    id: 'med-01',
    name: 'Telmisartan',
    dosage: '40 mg',
    frequency: 'Once daily (Morning)',
    reminderTimes: ['08:30 AM'],
    instructions: 'Take 30 minutes after breakfast with a full glass of water.',
    startDate: '2026-01-10',
    purpose: 'Blood Pressure Control',
    timeOfDay: 'morning',
    status: 'active',
    prescribedBy: 'Dr. Rajesh Sharma',
    colorTag: 'sage',
    remainingPills: 18,
    totalPills: 30,
    precautions: ['Take with full glass of water', 'Monitor morning BP'],
    interactions: ['Potassium supplements'],
  },
  {
    id: 'med-02',
    name: 'Metformin XR',
    dosage: '500 mg',
    frequency: 'Once daily (Morning)',
    reminderTimes: ['09:00 AM'],
    instructions: 'Take with or immediately after breakfast meal.',
    startDate: '2026-02-15',
    purpose: 'Blood Sugar Regulation',
    timeOfDay: 'morning',
    status: 'active',
    prescribedBy: 'Dr. Anita Desai',
    colorTag: 'peach',
    remainingPills: 8,
    totalPills: 30,
    precautions: ['Take with food to avoid stomach upset', 'Do not crush extended-release tablet'],
    interactions: ['Alcohol'],
  },
  {
    id: 'med-03',
    name: 'Shelcal 500 (Calcium + D3)',
    dosage: '500 mg / 400 IU',
    frequency: 'Once daily (Post lunch)',
    reminderTimes: ['01:30 PM'],
    instructions: 'Take after afternoon lunch.',
    startDate: '2026-03-01',
    purpose: 'Bone Density & Joint Health',
    timeOfDay: 'afternoon',
    status: 'active',
    prescribedBy: 'Dr. Vikram Mehta',
    colorTag: 'yellow',
    remainingPills: 22,
    totalPills: 30,
    precautions: ['Take after afternoon meal', 'Avoid taking with iron within 2 hrs'],
    interactions: ['Iron supplements', 'Thyroid medication'],
  },
  {
    id: 'med-04',
    name: 'Atorvastatin',
    dosage: '10 mg',
    frequency: 'Once daily (Night)',
    reminderTimes: ['09:00 PM'],
    instructions: 'Take before bed. Avoid grapefruit juice.',
    startDate: '2026-01-10',
    purpose: 'Lipid & Cholesterol Management',
    timeOfDay: 'night',
    status: 'active',
    prescribedBy: 'Dr. Rajesh Sharma',
    colorTag: 'lavender',
    remainingPills: 14,
    totalPills: 30,
    precautions: ['Take at bedtime', 'Avoid grapefruit juice'],
    interactions: ['Grapefruit juice', 'Antacids'],
  },
];

// Helper to get formatted date string YYYY-MM-DD offset from today
export function getRelativeDateString(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function generateInitialDoses(): MedicationDose[] {
  const doses: MedicationDose[] = [];
  const todayStr = getRelativeDateString(0);

  // Today's Doses
  doses.push({
    id: `dose-${todayStr}-01`,
    medicationId: 'med-01',
    medicationName: 'Telmisartan',
    dosage: '40 mg',
    instructions: 'Take 30 mins after breakfast',
    timeOfDay: 'morning',
    scheduledDate: todayStr,
    scheduledTime: '08:30 AM',
    status: 'taken',
    actionTimestamp: '08:35 AM',
    actionBy: 'Meera Patel',
    colorTag: 'sage',
    remainingPills: 18,
    precautions: ['Take with full glass of water'],
  });

  doses.push({
    id: `dose-${todayStr}-02`,
    medicationId: 'med-02',
    medicationName: 'Metformin XR',
    dosage: '500 mg',
    instructions: 'Take with breakfast',
    timeOfDay: 'morning',
    scheduledDate: todayStr,
    scheduledTime: '09:00 AM',
    status: 'upcoming',
    colorTag: 'peach',
    remainingPills: 8,
    precautions: ['Take with morning meal to prevent gastric upset'],
  });

  doses.push({
    id: `dose-${todayStr}-03`,
    medicationId: 'med-03',
    medicationName: 'Shelcal 500 (Calcium + D3)',
    dosage: '500 mg',
    instructions: 'Take after lunch',
    timeOfDay: 'afternoon',
    scheduledDate: todayStr,
    scheduledTime: '01:30 PM',
    status: 'upcoming',
    colorTag: 'yellow',
    remainingPills: 22,
    precautions: ['Take after afternoon meal'],
  });

  doses.push({
    id: `dose-${todayStr}-04`,
    medicationId: 'med-04',
    medicationName: 'Atorvastatin',
    dosage: '10 mg',
    instructions: 'Take before bed',
    timeOfDay: 'night',
    scheduledDate: todayStr,
    scheduledTime: '09:00 PM',
    status: 'upcoming',
    colorTag: 'lavender',
    remainingPills: 14,
    precautions: ['Take before bedtime'],
  });

  // Past 6 days history for realistic adherence chart
  const pastDays = [-6, -5, -4, -3, -2, -1];
  const meds = initialMedications;

  pastDays.forEach((offset) => {
    const dateStr = getRelativeDateString(offset);
    meds.forEach((med, idx) => {
      // 90% taken, occasional skip on day -3 for realism
      let status: MedicationDose['status'] = 'taken';
      if (offset === -3 && idx === 2) {
        status = 'skipped';
      } else if (offset === -5 && idx === 3) {
        status = 'missed';
      }

      doses.push({
        id: `dose-${dateStr}-${med.id}`,
        medicationId: med.id,
        medicationName: med.name,
        dosage: med.dosage,
        instructions: med.instructions,
        timeOfDay: med.timeOfDay,
        scheduledDate: dateStr,
        scheduledTime: med.reminderTimes[0] || '09:00 AM',
        status,
        actionTimestamp: status === 'taken' ? '09:12 AM' : undefined,
        actionBy: status === 'taken' ? (idx % 2 === 0 ? 'Meera Patel' : 'Priya Shah') : undefined,
        colorTag: med.colorTag,
      });
    });
  });

  return doses;
}

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-01',
    doctorName: 'Dr. Rajesh Sharma',
    specialty: 'Senior Cardiologist',
    hospital: 'Max Heart & Vascular Clinic, Indiranagar',
    date: getRelativeDateString(3),
    time: '10:30 AM',
    purpose: 'Quarterly cardiac review & 12-lead ECG review',
    contact: '+91 98200 87654',
    notes: 'Please bring last 2 weeks BP log book and fasting blood test results.',
    status: 'upcoming',
    accompaniedBy: 'Aarav Patel (Son)',
  },
  {
    id: 'apt-02',
    doctorName: 'Dr. Anita Desai',
    specialty: 'Ophthalmology & Retina Specialist',
    hospital: 'Narayana Nethralaya, Koramangala',
    date: getRelativeDateString(8),
    time: '04:00 PM',
    purpose: 'Annual diabetic eye fundus examination',
    contact: '+91 80 6612 1234',
    notes: 'Pupil dilation drops will be administered. Wear sunglasses on return.',
    status: 'upcoming',
    accompaniedBy: 'Priya Shah (Caretaker)',
  },
  {
    id: 'apt-03',
    doctorName: 'Dr. Vikram Mehta',
    specialty: 'Orthopedic & Joint Consultant',
    hospital: 'Apollo Spectra, Koramangala',
    date: getRelativeDateString(-14),
    time: '11:00 AM',
    purpose: 'Bilateral knee osteoarthritis physical assessment',
    contact: '+91 99000 55432',
    notes: 'Mild joint space reduction confirmed. Recommended daily gentle walking & Shelcal.',
    status: 'completed',
    accompaniedBy: 'Aarav Patel (Son)',
  },
];

export const initialCareCircle: CareMember[] = [
  {
    id: 'member-01',
    name: 'Meera Patel',
    role: 'elderly',
    relation: 'Care Recipient (Mom)',
    phone: '+91 98450 99887',
    email: 'meera.patel@saathicare.demo',
    status: 'active',
    responsibilities: ['Primary care recipient', 'Takes morning & night routine', 'Logs daily walks'],
    avatar: '👵',
    joinedDate: 'Jan 2026',
    isPrimary: true,
  },
  {
    id: 'member-02',
    name: 'Aarav Patel',
    role: 'family',
    relation: 'Son (Primary Guardian)',
    phone: '+91 98450 12345',
    email: 'aarav.patel@techinnovate.com',
    status: 'active',
    responsibilities: ['Doctor appointment coordination', 'Medication refills', 'Emergency decisions'],
    avatar: '👨‍💼',
    joinedDate: 'Jan 2026',
    isPrimary: true,
  },
  {
    id: 'member-03',
    name: 'Priya Shah',
    role: 'caretaker',
    relation: 'Certified Geriatric Caretaker',
    phone: '+91 97310 56789',
    email: 'priya.shah@caregiversplus.in',
    status: 'active',
    responsibilities: ['Morning vitals measurement', 'Medication administration support', 'Diet supervision'],
    avatar: '👩‍⚕️',
    joinedDate: 'Feb 2026',
  },
  {
    id: 'member-04',
    name: 'Ananya Patel',
    role: 'family',
    relation: 'Daughter (Living in Singapore)',
    phone: '+65 9123 4567',
    email: 'ananya.p@globalnet.sg',
    status: 'active',
    responsibilities: ['Weekly video call check-in', 'Care expense support'],
    avatar: '👩‍💻',
    joinedDate: 'Feb 2026',
  },
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-01',
    title: 'Morning Dose Taken',
    message: 'Meera took Telmisartan 40 mg at 8:35 AM.',
    category: 'medication',
    priority: 'normal',
    timestamp: 'Today, 8:35 AM',
    read: false,
    targetRole: 'all',
  },
  {
    id: 'notif-02',
    title: 'Upcoming Cardiology Review',
    message: 'Appointment with Dr. Rajesh Sharma scheduled in 3 days.',
    category: 'appointment',
    priority: 'normal',
    timestamp: 'Today, 7:00 AM',
    read: true,
    targetRole: 'all',
  },
  {
    id: 'notif-03',
    title: 'Vitals Logged by Priya',
    message: 'Blood Pressure 124/82 mmHg recorded normal.',
    category: 'care_circle',
    priority: 'normal',
    timestamp: 'Today, 8:15 AM',
    read: true,
    targetRole: 'all',
  },
];

export const initialActivities: ActivityLog[] = [
  {
    id: 'act-01',
    timestamp: 'Today, 8:35 AM',
    actor: 'Meera Patel',
    actorRole: 'elderly',
    action: 'Confirmed Medication',
    details: 'Took Telmisartan 40 mg with water',
    type: 'medication',
  },
  {
    id: 'act-02',
    timestamp: 'Today, 8:15 AM',
    actor: 'Priya Shah',
    actorRole: 'caretaker',
    action: 'Logged Morning Vitals',
    details: 'BP 124/82 mmHg, Pulse 74 bpm recorded',
    type: 'profile',
  },
  {
    id: 'act-03',
    timestamp: 'Yesterday, 9:02 PM',
    actor: 'Meera Patel',
    actorRole: 'elderly',
    action: 'Confirmed Medication',
    details: 'Took Atorvastatin 10 mg before sleeping',
    type: 'medication',
  },
  {
    id: 'act-04',
    timestamp: 'Yesterday, 4:20 PM',
    actor: 'Aarav Patel',
    actorRole: 'family',
    action: 'Confirmed Appointment',
    details: 'Scheduled Dr. Rajesh Sharma follow-up for cardiology checkup',
    type: 'appointment',
  },
  {
    id: 'act-05',
    timestamp: '3 days ago',
    actor: 'Aarav Patel',
    actorRole: 'family',
    action: 'Invited Care Member',
    details: 'Shared 6-digit access code with Priya Shah (Caretaker)',
    type: 'circle',
  },
];

export function getInitialStorageData(): StorageData {
  return {
    version: 1,
    profile: initialProfile,
    medications: initialMedications,
    doses: generateInitialDoses(),
    appointments: initialAppointments,
    careCircle: initialCareCircle,
    notifications: initialNotifications,
    activities: initialActivities,
    inviteCodes: [
      {
        code: '582914',
        role: 'caretaker',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      },
    ],
    settings: {
      notificationsEnabled: true,
      missedDoseEscalationMinutes: 15,
      largeTextElderlyMode: true,
      audioChimesEnabled: true,
    },
  };
}
