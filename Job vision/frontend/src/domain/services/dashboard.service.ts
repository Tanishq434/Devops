// Dashboard Service - Business logic for dashboard statistics

import { jobSignalRepository } from '@/domain/repositories/job-signal.repository';
import { ValidationError } from '@/core/errors/AppError';
import type { DashboardStats } from '@/types';

export class DashboardService {
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [newJobsToday, jobsViewed, jobsApplied, lastSignalTime] = await Promise.all([
      jobSignalRepository.countByStatusAndDate(userId, 'new', today),
      jobSignalRepository.countByStatus(userId, 'viewed'),
      jobSignalRepository.countByStatus(userId, 'applied'),
      jobSignalRepository.findLatestDetectedAt(userId),
    ]);

    return {
      newJobsToday,
      jobsViewed,
      jobsApplied,
      lastSignalTime,
    };
  }
}

export const dashboardService = new DashboardService();
