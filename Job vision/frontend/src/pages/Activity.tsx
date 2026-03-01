import { useEffect, useState } from 'react';
import { Clock, Eye, CheckCircle, X } from 'lucide-react';
import { useJobSignals } from '@/hooks/useJobSignals';
import { formatTimeAgo } from '@/utils/date';
import type { JobSignal } from '@/types';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';

const getStatusIcon = (status: JobSignal['status']) => {
  switch (status) {
    case 'viewed':
      return <Eye className="w-5 h-5 text-blue-500" />;
    case 'applied':
      return <CheckCircle className="w-5 h-5 text-accent" />;
    case 'ignored':
      return <X className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: JobSignal['status']) => {
  const variants = {
    new: 'default' as const,
    viewed: 'primary' as const,
    applied: 'success' as const,
    ignored: 'error' as const,
  };
  return <Badge variant={variants[status]}>{status}</Badge>;
};

export const Activity = () => {
  const { getJobSignals, isLoading } = useJobSignals();
  const [jobs, setJobs] = useState<JobSignal[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobSignals();
        // Sort by detectedAt, most recent first
        const sorted = data.sort(
          (a, b) => new Date(b.detectedAt).getTime() - new Date(a.detectedAt).getTime()
        );
        setJobs(sorted);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs();
  }, [getJobSignals]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity</h1>
        <p className="text-gray-600">Track your job search activity and interactions.</p>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No activity yet</h3>
            <p className="text-gray-600">Your job search activity will appear here.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getStatusIcon(job.status)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{formatTimeAgo(job.detectedAt)}</span>
                    <Badge variant="primary">{job.source}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
