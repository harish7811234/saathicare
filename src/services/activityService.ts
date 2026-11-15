import { ActivityLog, Role } from '../types';
import { storageService } from './storageService';

export const activityService = {
  getAll(): ActivityLog[] {
    return storageService.get().activities || [];
  },

  log(params: {
    actor: string;
    actorRole: Role | 'system';
    action: string;
    details: string;
    type: ActivityLog['type'];
  }): ActivityLog {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedTimestamp = `Today, ${timeStr}`;

    const newLog: ActivityLog = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: formattedTimestamp,
      actor: params.actor,
      actorRole: params.actorRole,
      action: params.action,
      details: params.details,
      type: params.type,
    };

    storageService.update((data) => ({
      ...data,
      activities: [newLog, ...(data.activities || [])],
    }));

    return newLog;
  },
};
