export type Category = 
  | 'Garbage' 
  | 'Roads' 
  | 'Water' 
  | 'Streetlights' 
  | 'Drainage' 
  | 'Safety' 
  | 'Public Property';

export type Severity = 'Low' | 'Moderate' | 'High' | 'Critical';

export type Status = 
  | 'reported' 
  | 'confirmed' 
  | 'escalated' 
  | 'acknowledged' 
  | 'action_started' 
  | 'resolved' 
  | 'community_verified';

export type EscalationLevel = 
  | 'Community' 
  | 'College / Local Admin' 
  | 'Municipal Corporation' 
  | 'Re-raised';

export interface TimelineEvent {
  id: string;
  stage: string;
  label: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  description?: string;
}

export interface NodeConnection {
  peopleCount: number;
  locationCount: number;
  affectedCount: number;
  authorities: string[];
}

export interface CivicIssue {
  id: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  latitude: number;
  longitude: number;
  photo: string;
  severity: Severity;
  communityReports: number;
  peopleAffected: number;
  locationsAffected: number;
  priorityScore: number; // 0 - 100
  status: Status;
  escalationLevel: EscalationLevel;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  authority: string;
  progress: number; // 0 - 100
  keywords: string[];
  mockNodeConnections?: NodeConnection;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface GraphTriple {
  source: string;
  relation: 
    | 'reported' 
    | 'affected_by' 
    | 'supports' 
    | 'located_at' 
    | 'similar_to' 
    | 'affects' 
    | 'escalated_to' 
    | 'responsible_for' 
    | 'has_evidence' 
    | 'has_status';
  target: string;
}

export interface AgentProcessingStatus {
  agentName: string;
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: string;
  detail: string;
}
