import { CivicIssue, Status, TimelineEvent } from '../types';

/**
 * RESOLUTION AGENT
 * Manages lifecycle status changes (reported -> confirmed -> escalated -> action_started -> resolved -> community_verified)
 * and syncs progress percentage & timeline state.
 */
export class ResolutionAgent {
  static setStatus(issue: CivicIssue, nextStatus: Status): CivicIssue {
    let progress = issue.progress;

    switch (nextStatus) {
      case 'reported':
        progress = 10;
        break;
      case 'confirmed':
        progress = 30;
        break;
      case 'escalated':
        progress = 50;
        break;
      case 'acknowledged':
        progress = 60;
        break;
      case 'action_started':
        progress = 75;
        break;
      case 'resolved':
        progress = 95;
        break;
      case 'community_verified':
        progress = 100;
        break;
    }

    const updatedTimeline: TimelineEvent[] = issue.timeline.map((event) => {
      if (nextStatus === 'action_started' && event.stage === 'action_pending') {
        return { ...event, label: 'Action started', completed: true, current: true, timestamp: 'Now' };
      }
      if ((nextStatus === 'resolved' || nextStatus === 'community_verified') && event.stage === 'resolved') {
        return { ...event, completed: true, current: nextStatus === 'resolved', timestamp: 'Just now' };
      }
      if (nextStatus === 'community_verified' && event.stage === 'verified') {
        return { ...event, completed: true, current: true, timestamp: 'Just now' };
      }
      return event;
    });

    return {
      ...issue,
      status: nextStatus,
      progress,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    };
  }
}
