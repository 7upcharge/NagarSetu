import { CivicIssue, EscalationLevel, TimelineEvent } from '../types';

/**
 * ESCALATION AGENT
 * Determines whether the issue should escalate from Community -> College/Local Admin -> Municipal Corporation.
 * Updates escalation level, authority assignment, progress %, and timeline events.
 */
export class EscalationAgent {
  static checkEscalation(issue: CivicIssue): CivicIssue {
    let newLevel: EscalationLevel = issue.escalationLevel;
    let newAuthority = issue.authority;
    let newProgress = issue.progress;

    // Escalation thresholds
    if (issue.priorityScore >= 75 || issue.peopleAffected >= 700 || issue.communityReports >= 40) {
      newLevel = 'Municipal Corporation';
      newAuthority = 'Municipal Corporation';
      if (issue.progress < 70) newProgress = Math.max(issue.progress, 75);
    } else if (issue.priorityScore >= 50 || issue.peopleAffected >= 300 || issue.communityReports >= 20) {
      newLevel = 'College / Local Admin';
      newAuthority = 'College Administration';
      if (issue.progress < 40) newProgress = Math.max(issue.progress, 50);
    }

    // Update timeline stages
    const updatedTimeline: TimelineEvent[] = issue.timeline.map((event) => {
      if (event.stage === 'priority_reached' && issue.priorityScore >= 60) {
        return { ...event, completed: true, timestamp: event.timestamp === 'Pending' ? 'Now' : event.timestamp };
      }
      if (event.stage === 'college_admin' && (newLevel === 'College / Local Admin' || newLevel === 'Municipal Corporation')) {
        return { ...event, completed: true, timestamp: event.timestamp === 'Pending' ? 'Now' : event.timestamp };
      }
      if (event.stage === 'municipal' && newLevel === 'Municipal Corporation') {
        return { ...event, completed: true, current: true, timestamp: event.timestamp === 'Pending' ? 'Now' : event.timestamp };
      }
      return event;
    });

    return {
      ...issue,
      escalationLevel: newLevel,
      authority: newAuthority,
      progress: newProgress,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString()
    };
  }
}
