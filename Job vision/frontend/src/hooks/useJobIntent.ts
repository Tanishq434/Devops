// Custom Hook for Job Intent Operations

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { jobIntentService } from '@/domain/services/job-intent.service';
import type { JobIntent } from '@/types';

export const useJobIntent = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getJobIntent = useCallback(async (): Promise<JobIntent | null> => {
    if (!user?.id) {
      setError(new Error('User not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      return await jobIntentService.getJobIntent(user.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch job intent');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const saveJobIntent = useCallback(
    async (intent: JobIntent): Promise<JobIntent> => {
      if (!user?.id) {
        const error = new Error('User not authenticated');
        setError(error);
        throw error;
      }

      setIsLoading(true);
      setError(null);

      try {
        return await jobIntentService.saveJobIntent(user.id, intent);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to save job intent');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  return {
    getJobIntent,
    saveJobIntent,
    isLoading,
    error,
  };
};
