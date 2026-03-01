import { ExternalLink, CheckCircle, X } from 'lucide-react';
import type { JobSignal } from '@/types';
import { Card } from '@/components/shared/Card';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { formatTimeAgo } from '@/utils/date';
import { cn } from '@/utils/cn';

interface JobCardProps {
  job: JobSignal;
  onMarkAsApplied: (id: string) => void;
  onMarkAsIgnored: (id: string) => void;
  onMarkAsViewed: (id: string) => void;
}

export const JobCard = ({
  job,
  onMarkAsApplied,
  onMarkAsIgnored,
  onMarkAsViewed,
}: JobCardProps) => {

  const handleViewClick = () => {
    onMarkAsViewed(job.id);
    window.open(job.linkedInUrl, '_blank');
  };

  const isNew = job.status === 'new';
  const isApplied = job.status === 'applied';

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-medium',
        isNew && 'ring-2 ring-primary/20',
        isApplied && 'opacity-60'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
            {isNew && <Badge variant="success">New</Badge>}
            {isApplied && <Badge variant="default">Applied</Badge>}
          </div>
          <p className="text-lg text-gray-700 mb-1">{job.company}</p>
          <p className="text-sm text-gray-600 mb-3">{job.location}</p>
          <div className="flex items-center gap-3">
            <Badge variant="primary">{job.source}</Badge>
            <span className="text-xs text-gray-500">{formatTimeAgo(job.detectedAt)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={handleViewClick}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View on LinkedIn
        </Button>
        {!isApplied && (
          <>
            <Button
              variant="secondary"
              onClick={() => onMarkAsApplied(job.id)}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Applied
            </Button>
            <Button
              variant="ghost"
              onClick={() => onMarkAsIgnored(job.id)}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Ignore
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
