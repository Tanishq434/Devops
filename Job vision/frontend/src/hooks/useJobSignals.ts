// Custom Hook for Job Signals Operations

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { jobSignalService } from '@/domain/services/job-signal.service';
import type { JobSignal, JobStatus } from '@/types';

export const useJobSignals = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getJobSignals = useCallback(async (): Promise<JobSignal[]> => {
    if (!user?.id) {
      setError(new Error('User not authenticated'));
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      return await jobSignalService.getJobSignals(user.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch job signals');
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const updateJobStatus = useCallback(
    async (signalId: string, status: JobStatus): Promise<void> => {
      if (!user?.id) {
        const error = new Error('User not authenticated');
        setError(error);
        throw error;
      }

      setIsLoading(true);
      setError(null);

      try {
        await jobSignalService.updateJobStatus(signalId, user.id, status);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update job status');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  const markAsViewed = useCallback(
    async (signalId: string): Promise<void> => {
      return updateJobStatus(signalId, 'viewed');
    },
    [updateJobStatus]
  );

  const markAsApplied = useCallback(
    async (signalId: string): Promise<void> => {
      return updateJobStatus(signalId, 'applied');
    },
    [updateJobStatus]
  );

  const markAsIgnored = useCallback(
    async (signalId: string): Promise<void> => {
      return updateJobStatus(signalId, 'ignored');
    },
    [updateJobStatus]
  );

  return {
    getJobSignals,
    markAsViewed,
    markAsApplied,
    markAsIgnored,
    isLoading,
    error,
  };
};
