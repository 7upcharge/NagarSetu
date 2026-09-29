import { CivicIssue, Severity } from '../types';

/**
 * Calculates issue priority score normalized to 0 - 100 based on core civic metrics:
 * 1. Community reports (35%) - scaled up to 100 reports
 * 2. People affected (40%) - scaled up to 2,000 affected people
 * 3. Severity (20%) - Critical=100, High=75, Moderate=50, Low=25
 * 4. Time unresolved (5%) - days since creation capped at 30 days
 */
export function calculatePriorityScore(issue: Partial<CivicIssue>): number {
  const reports = issue.communityReports || 1;
  const affected = issue.peopleAffected || 1;
  const severity: Severity = issue.severity || 'Moderate';
  
  // 1. Community reports factor (0 - 100)
  const reportFactor = Math.min(100, (reports / 100) * 100);

  // 2. People affected factor (0 - 100)
  const affectedFactor = Math.min(100, (affected / 2000) * 100);

  // 3. Severity factor (0 - 100)
  const severityScores: Record<Severity, number> = {
    Critical: 100,
    High: 75,
    Moderate: 50,
    Low: 25
  };
  const severityFactor = severityScores[severity] || 50;

  // 4. Time unresolved factor (0 - 100)
  const createdAt = issue.createdAt ? new Date(issue.createdAt).getTime() : Date.now();
  const daysDiff = Math.max(0, (Date.now() - createdAt) / (1000 * 60 * 60 * 24));
  const timeFactor = Math.min(100, (daysDiff / 30) * 100);

  // Weighted composition
  const rawScore = 
    (reportFactor * 0.35) + 
    (affectedFactor * 0.40) + 
    (severityFactor * 0.20) + 
    (timeFactor * 0.05);

  return Math.min(99, Math.max(1, Math.round(rawScore)));
}
