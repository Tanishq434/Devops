// Date Utility Functions

export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatLastSignalTime = (time: string | null): string => {
  if (!time) return 'Never';
  
  const date = new Date(time);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const getStartOfDay = (date: Date = new Date()): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
};

export const getDateRange = (range: string): { from: Date; to: Date } | null => {
  const now = new Date();
  const from = new Date();

  switch (range) {
    case 'today':
      from.setHours(0, 0, 0, 0);
      return { from, to: now };
    case 'week':
      from.setDate(now.getDate() - 7);
      return { from, to: now };
    case 'month':
      from.setMonth(now.getMonth() - 1);
      return { from, to: now };
    default:
      return null;
  }
};
