import { Role, User } from '../types';

export const DEMO_USERS: Record<Role, User> = {
  elderly: {
    id: 'user-meera',
    name: 'Meera Patel',
    role: 'elderly',
    email: 'meera.patel@saathicare.demo',
    avatar: '👵',
    relation: 'Care Recipient (72 yrs)',
    phone: '+91 98450 99887',
  },
  family: {
    id: 'user-aarav',
    name: 'Aarav Patel',
    role: 'family',
    email: 'aarav.patel@techinnovate.com',
    avatar: '👨‍💼',
    relation: 'Son & Primary Guardian',
    phone: '+91 98450 12345',
  },
  caretaker: {
    id: 'user-priya',
    name: 'Priya Shah',
    role: 'caretaker',
    email: 'priya.shah@caregiversplus.in',
    avatar: '👩‍⚕️',
    relation: 'Certified Geriatric Caretaker',
    phone: '+91 97310 56789',
  },
};
