// Job Intent Service - Business logic for job intents

import { jobIntentRepository } from '@/domain/repositories/job-intent.repository';
import { ValidationError } from '@/core/errors/AppError';
import type { JobIntent } from '@/types';

export class JobIntentService {
  async getJobIntent(userId: string): Promise<JobIntent | null> {
    if (!userId) {
      throw new ValidationError('User ID is required');
    }

    return await jobIntentRepository.findByUserId(userId);
  }

  async saveJobIntent(userId: string, intent: JobIntent): Promise<JobIntent> {
    this.validateJobIntent(intent);

    return await jobIntentRepository.upsert(userId, intent);
  }

  private validateJobIntent(intent: JobIntent): void {
    if (!intent.role) {
      throw new ValidationError('Role is required');
    }

    if (!intent.domain) {
      throw new ValidationError('Domain is required');
    }

    if (!intent.skills || intent.skills.length === 0) {
      throw new ValidationError('At least one skill is required');
    }

    if (!intent.location) {
      throw new ValidationError('Location is required');
    }

    if (!intent.jobType || intent.jobType.length === 0) {
      throw new ValidationError('At least one job type is required');
    }

    if (!intent.experienceLevel) {
      throw new ValidationError('Experience level is required');
    }
  }
}

export const jobIntentService = new JobIntentService();
