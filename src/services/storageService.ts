import { StorageData } from '../types';
import { getInitialStorageData } from '../data/seedData';

const STORAGE_KEY = 'saathicare_app_data_v1';
const CURRENT_VERSION = 1;

type StorageListener = (data: StorageData) => void;
const listeners: Set<StorageListener> = new Set();

export const storageService = {
  get(): StorageData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const initial = getInitialStorageData();
        this.save(initial);
        return initial;
      }
      const parsed = JSON.parse(raw) as StorageData;
      if (
        !parsed ||
        parsed.version !== CURRENT_VERSION ||
        !parsed.profile ||
        !Array.isArray(parsed.medications) ||
        !Array.isArray(parsed.doses) ||
        !Array.isArray(parsed.appointments)
      ) {
        console.warn('SaathiCare: Storage version mismatch or corrupted data. Re-seeding...');
        const initial = getInitialStorageData();
        this.save(initial);
        return initial;
      }
      return parsed;
    } catch (e) {
      console.error('SaathiCare: Error reading or parsing LocalStorage. Safely resetting to initial:', e);
      const initial = getInitialStorageData();
      this.save(initial);
      return initial;
    }
  },

  save(data: StorageData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      // Notify active listeners
      listeners.forEach((fn) => {
        try {
          fn(data);
        } catch (err) {
          console.error('Error in storage listener:', err);
        }
      });
    } catch (e) {
      console.error('SaathiCare: Failed to persist to LocalStorage:', e);
    }
  },

  update(updater: (prev: StorageData) => StorageData): StorageData {
    const current = this.get();
    const next = updater(current);
    this.save(next);
    return next;
  },

  subscribe(listener: StorageListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  reset(): StorageData {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = getInitialStorageData();
    this.save(fresh);
    return fresh;
  },
};
