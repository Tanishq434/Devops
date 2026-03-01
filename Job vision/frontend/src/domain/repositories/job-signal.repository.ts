// Job Signal Repository - Data access layer for job signals

import { supabase } from '@/core/database/client';
import { handleDatabaseError } from '@/core/database/error-handler';
import { mapJobSignalFromDb } from '@/core/database/mappers';
import type { JobSignal, JobStatus } from '@/types';

export class JobSignalRepository {
  async findByUserId(userId: string): Promise<JobSignal[]> {
    try {
      const { data, error } = await supabase
        .from('job_signals')
        .select('*')
        .eq('user_id', userId)
        .order('detected_at', { ascending: false });

      if (error) throw error;

      return data.map(mapJobSignalFromDb);
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }

  async updateStatus(
    signalId: string,
    userId: string,
    status: JobStatus
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('job_signals')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', signalId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }

  async countByStatus(userId: string, status: JobStatus): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('job_signals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', status);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }

  async countByStatusAndDate(
    userId: string,
    status: JobStatus,
    fromDate: Date
  ): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('job_signals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', status)
        .gte('detected_at', fromDate.toISOString());

      if (error) throw error;

      return count || 0;
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }

  async findLatestDetectedAt(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('job_signals')
        .select('detected_at')
        .eq('user_id', userId)
        .order('detected_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows found
        }
        throw error;
      }

      return data?.detected_at || null;
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }
}

export const jobSignalRepository = new JobSignalRepository();
