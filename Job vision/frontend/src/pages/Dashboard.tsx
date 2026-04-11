import { useEffect, useState } from 'react';
import { Briefcase, Eye, CheckCircle, Clock } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { formatLastSignalTime } from '@/utils/date';
import type { DashboardStats } from '@/types';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentJobsPreview } from '@/components/dashboard/RecentJobsPreview';

export const Dashboard = () => {
  const { getStats, isLoading, error } = useDashboardStats();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
  }, [getStats]);

  if (error) {
    console.error('Failed to fetch stats:', error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your job search overview.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-soft p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="New Jobs Today"
            value={stats?.newJobsToday || 0}
            icon={<Briefcase className="w-6 h-6" />}
          />
          <StatCard
            title="Jobs Viewed"
            value={stats?.jobsViewed || 0}
            icon={<Eye className="w-6 h-6" />}
          />
          <StatCard
            title="Jobs Applied"
            value={stats?.jobsApplied || 0}
            icon={<CheckCircle className="w-6 h-6" />}
          />
          <StatCard
            title="Last Signal"
            value={formatLastSignalTime(stats?.lastSignalTime || null)}
            icon={<Clock className="w-6 h-6" />}
          />
        </div>
      )}

      <RecentJobsPreview />
    </div>
  );
};
