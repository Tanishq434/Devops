// Custom Hook for Notifications

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { notificationService } from '@/domain/services/notification.service';
import type { Notification } from '@/types';

export const useNotifications = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getNotifications = useCallback(async (): Promise<Notification[]> => {
    if (!user?.id) {
      setError(new Error('User not authenticated'));
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      return await notificationService.getNotifications(user.id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch notifications');
      setError(error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const markAsRead = useCallback(
    async (notificationId: string): Promise<void> => {
      if (!user?.id) {
        const error = new Error('User not authenticated');
        setError(error);
        throw error;
      }

      setIsLoading(true);
      setError(null);

      try {
        await notificationService.markAsRead(notificationId, user.id);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to mark notification as read');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  return {
    getNotifications,
    markAsRead,
    isLoading,
    error,
  };
};
