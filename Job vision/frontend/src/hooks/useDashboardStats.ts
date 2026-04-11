// Custom Hook for Dashboard Statistics

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { dashboardService } from '@/domain/services/dashboard.service';
import type { DashboardStats } from '@/types';

export const useDashboardStats = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getStats = useCallback(async (): Promise<DashboardStats | null> => {
    if (!user?.id) {
      const authError = new Error('User not authenticated');
      setError(authError);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      return await dashboardService.getDashboardStats(user.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch dashboard stats');
      setError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    getStats,
    isLoading,
    error,
  };
};
