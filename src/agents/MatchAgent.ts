import { CivicIssue } from '../types';

export interface MatchResult {
  hasMatch: boolean;
  matchedIssue?: CivicIssue;
  similarityScore: number; // 0 - 100
  matchReason?: string;
}

/**
 * MATCH AGENT
 * Checks whether a newly submitted or searched issue matches an existing civic issue.
 * Uses mock semantic keyword matching & category comparison.
 */
export class MatchAgent {
  static findBestMatch(
    queryTitle: string,
    queryDescription: string,
    category: string,
    existingIssues: CivicIssue[]
  ): MatchResult {
    if (!queryTitle && !queryDescription) {
      return { hasMatch: false, similarityScore: 0 };
    }

    const queryText = `${queryTitle} ${queryDescription}`.toLowerCase();
    const queryTokens = queryText.split(/\s+/).filter(w => w.length > 2);

    let bestMatch: CivicIssue | undefined = undefined;
    let highestScore = 0;
    let reason = '';

    for (const issue of existingIssues) {
      // Category weight
      let score = 0;
      if (issue.category.toLowerCase() === category.toLowerCase()) {
        score += 30;
      }

      // Keyword token overlap
      let matchedCount = 0;
      const targetText = `${issue.title} ${issue.description} ${issue.location} ${issue.keywords.join(' ')}`.toLowerCase();
      
      for (const token of queryTokens) {
        if (targetText.includes(token)) {
          matchedCount++;
        }
      }

      if (queryTokens.length > 0) {
        const keywordScore = (matchedCount / queryTokens.length) * 70;
        score += keywordScore;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = issue;
        reason = `Matched category (${issue.category}) and key terms with existing report #${issue.id}.`;
      }
    }

    // Threshold for duplicate detection (e.g. 50%)
    if (highestScore >= 45 && bestMatch) {
      return {
        hasMatch: true,
        matchedIssue: bestMatch,
        similarityScore: Math.round(highestScore),
        matchReason: reason
      };
    }

    return {
      hasMatch: false,
      similarityScore: Math.round(highestScore),
      matchReason: 'No existing nearby issue met similarity threshold.'
    };
  }
}
