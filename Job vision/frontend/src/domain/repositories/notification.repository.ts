// Notification Repository - Data access layer for notifications

import { supabase } from '@/core/database/client';
import { handleDatabaseError } from '@/core/database/error-handler';
import { mapNotificationFromDb } from '@/core/database/mappers';
import type { Notification } from '@/types';

export class NotificationRepository {
  async findByUserId(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(mapNotificationFromDb);
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      handleDatabaseError(error as Error);
    }
  }
}

export const notificationRepository = new NotificationRepository();
