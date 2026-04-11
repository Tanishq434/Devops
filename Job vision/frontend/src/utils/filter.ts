// Filter Utility Functions

import type { JobSignal, JobStatus } from '@/types';
import { getDateRange } from './date';

export const filterJobSignals = (
  jobs: JobSignal[],
  filters: {
    status?: JobStatus;
    dateRange?: string;
  }
): JobSignal[] => {
  let filtered = [...jobs];

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter((job) => job.status === filters.status);
  }

  // Filter by date range
  if (filters.dateRange && filters.dateRange !== 'all') {
    const dateRange = getDateRange(filters.dateRange);
    if (dateRange) {
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.detectedAt);
        return jobDate >= dateRange.from && jobDate <= dateRange.to;
      });
    }
  }

  return filtered;
};
