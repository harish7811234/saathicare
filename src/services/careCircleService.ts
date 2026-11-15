import { CareMember, Role } from '../types';
import { storageService } from './storageService';
import { activityService } from './activityService';
import { notificationService } from './notificationService';

export const careCircleService = {
  getAll(): CareMember[] {
    return storageService.get().careCircle || [];
  },

  getInviteCodes(): Array<{ code: string; role: Role; createdAt: string; expiresAt: string }> {
    return storageService.get().inviteCodes || [];
  },

  generateInviteCode(role: Role, actorName: string, actorRole: Role): string {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    storageService.update((data) => ({
      ...data,
      inviteCodes: [
        { code, role, createdAt: now.toISOString(), expiresAt },
        ...(data.inviteCodes || []),
      ],
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Generated Circle Invitation',
      details: `Created 6-digit access code for ${role === 'caretaker' ? 'Caretaker' : 'Family Member'} role`,
      type: 'circle',
    });

    return code;
  },

  joinWithCode(params: {
    code: string;
    name: string;
    relation: string;
    phone: string;
    email: string;
    responsibilities?: string[];
  }): { success: boolean; member?: CareMember; error?: string } {
    const data = storageService.get();
    const invite = data.inviteCodes?.find((inv) => inv.code.trim() === params.code.trim());

    if (!invite) {
      return { success: false, error: 'Invalid 6-digit invitation code. Please check and try again.' };
    }

    const newMember: CareMember = {
      id: `member-${Date.now()}`,
      name: params.name,
      role: invite.role,
      relation: params.relation || (invite.role === 'caretaker' ? 'Assistant Caregiver' : 'Family Member'),
      phone: params.phone || '+91 98000 00000',
      email: params.email || 'care.member@saathicare.demo',
      status: 'active',
      responsibilities: params.responsibilities?.length
        ? params.responsibilities
        : invite.role === 'caretaker'
        ? ['Daily check-in support', 'Routine medication observation']
        : ['Emergency contact', 'Healthcare companionship'],
      avatar: invite.role === 'caretaker' ? '🩺' : '🤝',
      joinedDate: 'Today',
    };

    // Add member and remove used code
    storageService.update((prev) => ({
      ...prev,
      careCircle: [...prev.careCircle, newMember],
      inviteCodes: prev.inviteCodes.filter((inv) => inv.code !== invite.code),
    }));

    activityService.log({
      actor: newMember.name,
      actorRole: newMember.role,
      action: 'Joined Care Circle',
      details: `Accepted invite code as ${invite.role.toUpperCase()}: ${newMember.relation}`,
      type: 'circle',
    });

    notificationService.create({
      title: 'New Member Joined Care Circle',
      message: `${newMember.name} joined as ${newMember.relation} via invitation code.`,
      category: 'care_circle',
      priority: 'normal',
      targetRole: 'all',
    });

    return { success: true, member: newMember };
  },

  removeMember(id: string, actorName: string, actorRole: Role): void {
    const member = this.getAll().find((m) => m.id === id);
    if (!member || member.isPrimary) return;

    storageService.update((data) => ({
      ...data,
      careCircle: data.careCircle.filter((m) => m.id !== id),
    }));

    activityService.log({
      actor: actorName,
      actorRole,
      action: 'Removed Circle Member',
      details: `Removed ${member.name} (${member.relation})`,
      type: 'circle',
    });
  },
};
