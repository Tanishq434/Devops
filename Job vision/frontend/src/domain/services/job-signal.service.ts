// Job Signal Service - Business logic for job signals

import { jobSignalRepository } from '@/domain/repositories/job-signal.repository';
import { ValidationError, NotFoundError } from '@/core/errors/AppError';
import type { JobSignal, JobStatus } from '@/types';

export class JobSignalService {
  async getJobSignals(userId: string): Promise<JobSignal[]> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    return await jobSignalRepository.findByUserId(userId);
  }

  async updateJobStatus(
    signalId: string,
    userId: string,
    status: JobStatus
  ): Promise<void> {
    if (!signalId) {
      throw new ValidationError('Signal ID is required');
    }

    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    const validStatuses: JobStatus[] = ['new', 'viewed', 'applied', 'ignored'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Invalid status: ${status}`);
    }

    await jobSignalRepository.updateStatus(signalId, userId, status);
  }

  async markAsViewed(signalId: string, userId: string): Promise<void> {
    await this.updateJobStatus(signalId, userId, 'viewed');
  }

  async markAsApplied(signalId: string, userId: string): Promise<void> {
    await this.updateJobStatus(signalId, userId, 'applied');
  }

  async markAsIgnored(signalId: string, userId: string): Promise<void> {
    await this.updateJobStatus(signalId, userId, 'ignored');
  }
}

export const jobSignalService = new JobSignalService();
