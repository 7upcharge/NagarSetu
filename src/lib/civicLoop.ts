import { CivicIssue, Category, Severity, Status } from '../types';
import { ReportAgent } from '../agents/ReportAgent';
import { MatchAgent, MatchResult } from '../agents/MatchAgent';
import { ImpactAgent } from '../agents/ImpactAgent';
import { PriorityAgent } from '../agents/PriorityAgent';
import { EscalationAgent } from '../agents/EscalationAgent';
import { ResolutionAgent } from '../agents/ResolutionAgent';

export interface CivicLoopState {
  issue: CivicIssue;
  matchResult?: MatchResult;
  history: string[];
}

/**
 * Composable Civic Feedback Loop Pipeline
 */
export class CivicLoopPipeline {
  private state: CivicLoopState;

  constructor(initialIssue?: CivicIssue) {
    this.state = {
      issue: initialIssue || {
        id: 'temp',
        title: '',
        description: '',
        category: 'Garbage',
        location: '',
        latitude: 0,
        longitude: 0,
        photo: '',
        severity: 'Moderate',
        communityReports: 1,
        peopleAffected: 1,
        locationsAffected: 1,
        priorityScore: 50,
        status: 'reported',
        escalationLevel: 'Community',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [],
        authority: 'College Administration',
        progress: 10,
        keywords: []
      },
      history: []
    };
  }

  report(title: string, description: string, category: Category, location: string, photo?: string, severity?: Severity): this {
    this.state.issue = ReportAgent.normalizeReport({ title, description, category, location, photo, severity });
    this.state.history.push(`[REPORT] Issue normalized: "${title}"`);
    return this;
  }

  match(existingIssues: CivicIssue[]): this {
    const result = MatchAgent.findBestMatch(
      this.state.issue.title,
      this.state.issue.description,
      this.state.issue.category,
      existingIssues
    );
    this.state.matchResult = result;
    if (result.hasMatch) {
      this.state.history.push(`[MATCH] Potential duplicate found: #${result.matchedIssue?.id} (${result.similarityScore}% match)`);
    } else {
      this.state.history.push(`[MATCH] No existing duplicate detected.`);
    }
    return this;
  }

  aggregate(deltaReports = 1, deltaAffected = 1): this {
    this.state.issue = ImpactAgent.applyUserSupport(this.state.issue, deltaReports, deltaAffected);
    this.state.history.push(`[AGGREGATE] Reports: ${this.state.issue.communityReports}, Affected: ${this.state.issue.peopleAffected}`);
    return this;
  }

  calculateImpact(): this {
    // Impact calculation verification step
    this.state.history.push(`[IMPACT] Locations affected: ${this.state.issue.locationsAffected}`);
    return this;
  }

  calculatePriority(): this {
    this.state.issue = PriorityAgent.evaluatePriority(this.state.issue);
    this.state.history.push(`[PRIORITY] Recalculated score: ${this.state.issue.priorityScore}/100`);
    return this;
  }

  evaluateEscalation(): this {
    this.state.issue = EscalationAgent.checkEscalation(this.state.issue);
    this.state.history.push(`[ESCALATE] Escalation tier: ${this.state.issue.escalationLevel}`);
    return this;
  }

  updateStatus(nextStatus: Status): this {
    this.state.issue = ResolutionAgent.setStatus(this.state.issue, nextStatus);
    this.state.history.push(`[STATUS] Status set to: ${nextStatus}`);
    return this;
  }

  resolve(): this {
    this.state.issue = ResolutionAgent.setStatus(this.state.issue, 'resolved');
    this.state.history.push(`[RESOLVE] Problem resolved.`);
    return this;
  }

  verify(): this {
    this.state.issue = ResolutionAgent.setStatus(this.state.issue, 'community_verified');
    this.state.history.push(`[VERIFY] Community verification completed.`);
    return this;
  }

  execute(): CivicLoopState {
    return this.state;
  }
}
