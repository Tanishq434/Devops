export interface User {
  id: string;
  email: string;
  name: string;
}

export interface JobIntent {
  role: string;
  domain: string;
  skills: string[];
  location: string;
  jobType: string[];
  experienceLevel: string;
}

export type JobStatus = 'new' | 'viewed' | 'applied' | 'ignored';

export interface JobSignal {
  id: string;
  title: string;
  company: string;
  location: string;
  detectedAt: string;
  source: 'linkedin';
  status: JobStatus;
  linkedInUrl: string;
}

export interface Notification {
  id: string;
  jobSignalId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  newJobsToday: number;
  jobsViewed: number;
  jobsApplied: number;
  lastSignalTime: string | null;
}
