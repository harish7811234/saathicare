import { ElderlyProfile, Role } from '../types';
import { storageService } from './storageService';
import { activityService } from './activityService';

export const profileService = {
  get(): ElderlyProfile {
    return storageService.get().profile;
  },

  update(profile: ElderlyProfile, actorName: string, actorRole: Role): ElderlyProfile {
    storageService.update((data) => ({
      ...data,
      profile,
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Updated Health Profile',
      details: 'Updated vitals and clinical information',
      type: 'profile',
    });

    return profile;
  },

  updateVitals(
    vitals: ElderlyProfile['vitals'],
    actorName: string,
    actorRole: Role
  ): ElderlyProfile['vitals'] {
    const profile = this.get();
    const updatedProfile: ElderlyProfile = {
      ...profile,
      vitals: {
        ...vitals,
        lastUpdated: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      },
    };

    storageService.update((data) => ({
      ...data,
      profile: updatedProfile,
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Recorded Daily Vitals',
      details: `BP: ${vitals.bloodPressure}, Sugar: ${vitals.bloodSugar}, Pulse: ${vitals.pulse}`,
      type: 'profile',
    });

    return updatedProfile.vitals;
  },
};
