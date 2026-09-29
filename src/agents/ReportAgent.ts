import { Category, CivicIssue, Severity } from '../types';
import { calculatePriorityScore } from '../lib/priority';

export interface RawReportInput {
  title: string;
  description: string;
  category: Category;
  location: string;
  photo?: string;
  severity?: Severity;
}

/**
 * REPORT AGENT
 * Takes raw user input and normalizes it into a structured CivicIssue object.
 */
export class ReportAgent {
  static normalizeReport(input: RawReportInput): CivicIssue {
    const id = `issue-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const severity = input.severity || 'Moderate';
    
    // Extract search keywords from title & description
    const rawKeywords = `${input.title} ${input.description} ${input.location} ${input.category}`
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const keywords = Array.from(new Set(rawKeywords));

    const initialIssue: CivicIssue = {
      id,
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      location: input.location.trim() || 'Local Neighborhood',
      latitude: 22.7196 + (Math.random() - 0.5) * 0.01,
      longitude: 75.8577 + (Math.random() - 0.5) * 0.01,
      photo: input.photo || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      severity,
      communityReports: 1,
      peopleAffected: 12,
      locationsAffected: 1,
      priorityScore: 0,
      status: 'reported',
      escalationLevel: 'Community',
      createdAt: timestamp,
      updatedAt: timestamp,
      authority: 'College Administration',
      progress: 10,
      keywords,
      timeline: [
        {
          id: `t-${Date.now()}-1`,
          stage: 'reported',
          label: 'Reported',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true,
          description: 'New community report submitted.'
        },
        { id: `t-${Date.now()}-2`, stage: 'confirmed', label: 'Community confirmed', timestamp: 'Pending', completed: false, current: false },
        { id: `t-${Date.now()}-3`, stage: 'priority_reached', label: 'Priority threshold reached', timestamp: 'Pending', completed: false, current: false },
        { id: `t-${Date.now()}-4`, stage: 'college_admin', label: 'College administration', timestamp: 'Pending', completed: false, current: false },
        { id: `t-${Date.now()}-5`, stage: 'municipal', label: 'Municipal Corporation', timestamp: 'Pending', completed: false, current: false },
        { id: `t-${Date.now()}-6`, stage: 'action_pending', label: 'Action pending', timestamp: 'Pending', completed: false, current: false },
        { id: `t-${Date.now()}-7`, stage: 'resolved', label: 'Resolved', timestamp: 'Pending', completed: false, current: false },
        { id: `t-${Date.now()}-8`, stage: 'verified', label: 'Community verified', timestamp: 'Pending', completed: false, current: false }
      ]
    };

    initialIssue.priorityScore = calculatePriorityScore(initialIssue);
    return initialIssue;
  }
}
