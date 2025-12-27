export enum IncidentType {
  FIRE = 'Fire',
  MEDICAL = 'Medical',
  POLICE = 'Police',
  HAZARD = 'Hazard',
  OTHER = 'Other'
}

export enum IncidentStatus {
  UNVERIFIED = 'Unverified',
  VERIFIED = 'Verified',
  RESOLVED = 'Resolved'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface Note {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Incident {
  id: string;
  type: IncidentType;
  description: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  severity: Severity;
  status: IncidentStatus;
  timestamp: string;
  upvotes: number;
  upvotedBy: string[];
  imageUrl?: string;
  notes: Note[];
}

export interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'upvotes' | 'upvotedBy' | 'notes' | 'status'>) => void;
  updateStatus: (id: string, status: IncidentStatus) => void;
  addNote: (id: string, note: string) => void;
  upvoteIncident: (id: string, userId: string) => void;
}

// Authentication Types
export enum UserRole {
  CITIZEN = 'Citizen',
  RESPONDER = 'Responder'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}