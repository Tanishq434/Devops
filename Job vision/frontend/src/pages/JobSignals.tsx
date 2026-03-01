import { useEffect, useState } from 'react';
import { useJobSignals } from '@/hooks/useJobSignals';
import { filterJobSignals } from '@/utils/filter';
import type { JobSignal, JobStatus } from '@/types';
import { JobCard } from '@/components/jobs/JobCard';
import { JobFilters } from '@/components/jobs/JobFilters';
import { SkeletonLoader } from '@/components/jobs/SkeletonLoader';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { Briefcase } from 'lucide-react';

export const JobSignals = () => {
  const { getJobSignals, markAsViewed, markAsApplied, markAsIgnored, isLoading: isLoadingJobs } = useJobSignals();
  const [jobs, setJobs] = useState<JobSignal[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobSignal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobSignals();
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        showToast('Failed to load job signals', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [getJobSignals, showToast]);

  const handleFilterChange = (filters: { status?: JobStatus; dateRange?: string }) => {
    const filtered = filterJobSignals(jobs, filters);
    setFilteredJobs(filtered);
  };

  const handleMarkAsViewed = async (id: string) => {
    try {
      await markAsViewed(id);
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: 'viewed' as JobStatus } : job))
      );
      setFilteredJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: 'viewed' as JobStatus } : job))
      );
    } catch (error) {
      console.error('Failed to mark as viewed:', error);
    }
  };

  const handleMarkAsApplied = async (id: string) => {
    try {
      await markAsApplied(id);
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: 'applied' as JobStatus } : job))
      );
      setFilteredJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status: 'applied' as JobStatus } : job))
      );
      showToast('Marked as applied!', 'success');
    } catch (error) {
      showToast('Failed to mark as applied', 'error');
    }
  };

  const handleMarkAsIgnored = async (id: string) => {
    try {
      await markAsIgnored(id);
      setJobs((prev) => prev.filter((job) => job.id !== id));
      setFilteredJobs((prev) => prev.filter((job) => job.id !== id));
      showToast('Job ignored', 'info');
    } catch (error) {
      showToast('Failed to ignore job', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Briefcase className="w-8 h-8" />
          Job Signals
        </h1>
        <p className="text-gray-600">Discover relevant job opportunities tailored to your preferences.</p>
      </div>

      <JobFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-soft p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No job signals found</h3>
          <p className="text-gray-600">
            {jobs.length === 0
              ? "We're monitoring for new opportunities. Check back soon!"
              : 'Try adjusting your filters to see more results.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onMarkAsViewed={handleMarkAsViewed}
              onMarkAsApplied={handleMarkAsApplied}
              onMarkAsIgnored={handleMarkAsIgnored}
            />
          ))}
        </div>
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
