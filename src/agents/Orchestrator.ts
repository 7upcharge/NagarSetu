import { CivicIssue, Category, Severity, Status } from '../types';
import { ReportAgent, RawReportInput } from './ReportAgent';
import { MatchAgent, MatchResult } from './MatchAgent';
import { ImpactAgent } from './ImpactAgent';
import { PriorityAgent } from './PriorityAgent';
import { EscalationAgent } from './EscalationAgent';
import { ResolutionAgent } from './ResolutionAgent';

export interface OrchestrationResult {
  issue: CivicIssue;
  matchResult: MatchResult;
  processingSteps: {
    agent: string;
    action: string;
    timestamp: string;
  }[];
}

/**
 * ORCHESTRATOR
 * Coordinates the full multi-agent workflow:
 * ReportAgent -> MatchAgent -> ImpactAgent -> PriorityAgent -> EscalationAgent -> ResolutionAgent
 */
export class Orchestrator {
  /**
   * Process a brand new user report input
   */
  static processNewReport(
    input: RawReportInput,
    existingIssues: CivicIssue[]
  ): OrchestrationResult {
    const steps: { agent: string; action: string; timestamp: string }[] = [];
    const now = () => new Date().toLocaleTimeString();

    // 1. ReportAgent: Normalize raw input
    let issue = ReportAgent.normalizeReport(input);
    steps.push({ agent: 'ReportAgent', action: 'Normalized report metadata and keywords', timestamp: now() });

    // 2. MatchAgent: Check semantic duplicates
    const matchResult = MatchAgent.findBestMatch(
      input.title,
      input.description,
      input.category,
      existingIssues
    );
    steps.push({
      agent: 'MatchAgent',
      action: matchResult.hasMatch
        ? `Found potential match #${matchResult.matchedIssue?.id} (${matchResult.similarityScore}% similarity)`
        : 'No duplicate issue threshold met',
      timestamp: now()
    });

    // 3. ImpactAgent: Calculate initial impact metrics
    issue = ImpactAgent.applyUserSupport(issue, 0, 0);
    steps.push({ agent: 'ImpactAgent', action: `Assessed community scope (${issue.peopleAffected} estimated affected)`, timestamp: now() });

    // 4. PriorityAgent: Calculate initial priority score
    issue = PriorityAgent.evaluatePriority(issue);
    steps.push({ agent: 'PriorityAgent', action: `Calculated priority score (${issue.priorityScore}/100)`, timestamp: now() });

    // 5. EscalationAgent: Evaluate escalation level
    issue = EscalationAgent.checkEscalation(issue);
    steps.push({ agent: 'EscalationAgent', action: `Assigned initial escalation tier (${issue.escalationLevel})`, timestamp: now() });

    return { issue, matchResult, processingSteps: steps };
  }

  /**
   * Process user joining / supporting an existing issue ("I'm affected too")
   */
  static processUserSupport(
    issue: CivicIssue,
    deltaReports = 1,
    deltaAffected = 1
  ): OrchestrationResult {
    const steps: { agent: string; action: string; timestamp: string }[] = [];
    const now = () => new Date().toLocaleTimeString();

    // 1. ImpactAgent: Increase signals
    let updated = ImpactAgent.applyUserSupport(issue, deltaReports, deltaAffected);
    steps.push({
      agent: 'ImpactAgent',
      action: `Aggregated +${deltaReports} report, +${deltaAffected} affected people. Total: ${updated.communityReports} reports / ${updated.peopleAffected} affected.`,
      timestamp: now()
    });

    // 2. PriorityAgent: Recalculate priority
    updated = PriorityAgent.evaluatePriority(updated);
    steps.push({
      agent: 'PriorityAgent',
      action: `Recalculated priority score: ${updated.priorityScore}/100`,
      timestamp: now()
    });

    // 3. EscalationAgent: Check if priority threshold triggers escalation tier change
    updated = EscalationAgent.checkEscalation(updated);
    steps.push({
      agent: 'EscalationAgent',
      action: `Evaluated escalation status: ${updated.escalationLevel} (${updated.authority})`,
      timestamp: now()
    });

    return {
      issue: updated,
      matchResult: { hasMatch: false, similarityScore: 0 },
      processingSteps: steps
    };
  }

  /**
   * Developer / Demo override actions
   */
  static processStatusChange(issue: CivicIssue, nextStatus: Status): CivicIssue {
    let updated = ResolutionAgent.setStatus(issue, nextStatus);
    updated = PriorityAgent.evaluatePriority(updated);
    return EscalationAgent.checkEscalation(updated);
  }

  static processSeverityChange(issue: CivicIssue, nextSeverity: Severity): CivicIssue {
    let updated = { ...issue, severity: nextSeverity };
    updated = PriorityAgent.evaluatePriority(updated);
    return EscalationAgent.checkEscalation(updated);
  }
}
