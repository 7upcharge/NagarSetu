import { CivicIssue } from '../types';

/**
 * IMPACT AGENT
 * Aggregates community signals (reports, affected people, locations)
 * when new citizens join or support an issue.
 */
export class ImpactAgent {
  static applyUserSupport(issue: CivicIssue, deltaReports = 1, deltaAffected = 1): CivicIssue {
    const updatedReports = issue.communityReports + deltaReports;
    const updatedAffected = issue.peopleAffected + deltaAffected;
    
    // Dynamically calculate affected locations scale
    const updatedLocations = Math.max(
      issue.locationsAffected, 
      Math.min(25, Math.ceil(updatedReports / 6))
    );

    return {
      ...issue,
      communityReports: updatedReports,
      peopleAffected: updatedAffected,
      locationsAffected: updatedLocations,
      updatedAt: new Date().toISOString()
    };
  }
}
