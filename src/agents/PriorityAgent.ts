import { CivicIssue } from '../types';
import { calculatePriorityScore } from '../lib/priority';

/**
 * PRIORITY AGENT
 * Recalculates issue priority using community signal + affected population + severity + time unresolved.
 */
export class PriorityAgent {
  static evaluatePriority(issue: CivicIssue): CivicIssue {
    const newScore = calculatePriorityScore(issue);

    return {
      ...issue,
      priorityScore: newScore,
      updatedAt: new Date().toISOString()
    };
  }
}
