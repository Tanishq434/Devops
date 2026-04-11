import { useState } from 'react';
import { Filter } from 'lucide-react';
import { cn } from '@/utils/cn';
import { DATE_FILTERS } from '@/config/constants';
import type { JobStatus } from '@/types';

interface JobFiltersProps {
  onFilterChange: (filters: { status?: JobStatus; dateRange?: string }) => void;
}

export const JobFilters = ({ onFilterChange }: JobFiltersProps) => {
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const handleStatusChange = (status: JobStatus | 'all') => {
    setStatusFilter(status);
    onFilterChange({
      status: status === 'all' ? undefined : status,
      dateRange: dateRange === 'all' ? undefined : dateRange,
    });
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    onFilterChange({
      status: statusFilter === 'all' ? undefined : statusFilter,
      dateRange: range === 'all' ? undefined : range,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-gray-700">
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filters:</span>
        </div>
        <div className="flex gap-2">
          {(['all', 'new', 'viewed', 'applied', 'ignored'] as const).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <select
          value={dateRange}
          onChange={(e) => handleDateRangeChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value={DATE_FILTERS.ALL}>All time</option>
          <option value={DATE_FILTERS.TODAY}>Today</option>
          <option value={DATE_FILTERS.WEEK}>This week</option>
          <option value={DATE_FILTERS.MONTH}>This month</option>
        </select>
      </div>
    </div>
  );
};
