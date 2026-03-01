// Job Intent Repository - Data access layer for job intents

import { supabase } from '@/core/database/client';
import { handleDatabaseError } from '@/core/database/error-handler';
import { mapJobIntentFromDb, mapJobIntentToDb } from '@/core/database/mappers';
import type { JobIntent } from '@/types';

export class JobIntentRepository {
  async findByUserId(userId: string): Promise<JobIntent | null> {
    try {
      const { data, error } = await supabase
        .from('job_intents')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows found
        }
        throw error;
      }

      return data ? mapJobIntentFromDb(data) : null;
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }

  async upsert(userId: string, intent: JobIntent): Promise<JobIntent> {
    try {
      const dbData = mapJobIntentToDb(intent, userId);
      
      const { data, error } = await supabase
        .from('job_intents')
        .upsert(dbData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      return mapJobIntentFromDb(data);
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }
}

export const jobIntentRepository = new JobIntentRepository();
