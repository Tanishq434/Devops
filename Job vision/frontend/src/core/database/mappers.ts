// Database Mappers - Transform database entities to domain models

import type { JobIntent, JobSignal, Notification } from '@/types';
import type { Database } from '@/types/database';

type JobIntentRow = Database['public']['Tables']['job_intents']['Row'];
type JobSignalRow = Database['public']['Tables']['job_signals']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

export const mapJobIntentFromDb = (row: JobIntentRow): JobIntent => ({
  role: row.role,
  domain: row.domain,
  skills: row.skills || [],
  location: row.location,
  jobType: row.job_type || [],
  experienceLevel: row.experience_level,
});

export const mapJobIntentToDb = (intent: JobIntent, userId: string) => ({
  user_id: userId,
  role: intent.role,
  domain: intent.domain,
  skills: intent.skills,
  location: intent.location,
  job_type: intent.jobType,
  experience_level: intent.experienceLevel,
  updated_at: new Date().toISOString(),
});

export const mapJobSignalFromDb = (row: JobSignalRow): JobSignal => ({
  id: row.id,
  title: row.title,
  company: row.company,
  location: row.location,
  detectedAt: row.detected_at,
  source: row.source as 'linkedin',
  status: row.status as JobSignal['status'],
  linkedInUrl: row.linkedin_url,
});

export const mapNotificationFromDb = (row: NotificationRow): Notification => ({
  id: row.id,
  jobSignalId: row.job_signal_id,
  message: row.message,
  read: row.read,
  createdAt: row.created_at,
});
