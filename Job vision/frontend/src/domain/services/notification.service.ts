// Notification Service - Business logic for notifications

import { notificationRepository } from '@/domain/repositories/notification.repository';
import { ValidationError } from '@/core/errors/AppError';
import type { Notification } from '@/types';

export class NotificationService {
  async getNotifications(userId: string): Promise<Notification[]> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    return await notificationRepository.findByUserId(userId);
  }

  async markAsRead(notificationId: string, userId: string): Promise<void> {
    if (!notificationId) {
      throw new ValidationError('Notification ID is required');
    }

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    await notificationRepository.markAsRead(notificationId, userId);
  }

  getUnreadCount(notifications: Notification[]): number {
    return notifications.filter((n) => !n.read).length;
  }
}

export const notificationService = new NotificationService();
