import { useEffect, useState } from 'react';
import { Briefcase, ExternalLink } from 'lucide-react';
import { useJobSignals } from '@/hooks/useJobSignals';
import { formatTimeAgo } from '@/utils/date';
import type { JobSignal } from '@/types';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';

export const RecentJobsPreview = () => {
  const { getJobSignals, isLoading } = useJobSignals();
  const [jobs, setJobs] = useState<JobSignal[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobSignals();
        setJobs(data.slice(0, 5)); // Show latest 5
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs();
  }, [getJobSignals]);

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Recent Job Signals
        </h2>
        <Link to={ROUTES.JOBS}>
          <Button variant="ghost" className="text-sm">
            View All
          </Button>
        </Link>
      </div>
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No job signals yet</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{job.company} • {job.location}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="primary">{job.source}</Badge>
                  <span className="text-xs text-gray-500">{formatTimeAgo(job.detectedAt)}</span>
                </div>
              </div>
              <a
                href={job.linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4"
              >
                <Button variant="primary" className="text-sm">
                  <ExternalLink className="w-4 h-4" />
                  View
                </Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
