import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { notificationService } from '@/domain/services/notification.service';
import { formatTimeAgo } from '@/utils/date';
import type { Notification } from '@/types';
import { cn } from '@/utils/cn';
import { NOTIFICATION_POLL_INTERVAL } from '@/config/constants';

export const NotificationDropdown = () => {
  const { getNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
        setUnreadCount(notificationService.getUnreadCount(data));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, NOTIFICATION_POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [getNotifications]);

  const handleNotificationClick = (notification: Notification) => {
    window.open(`https://linkedin.com/jobs/view/${notification.jobSignalId}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-medium border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      'w-full text-left p-4 hover:bg-gray-50 transition-colors',
                      !notification.read && 'bg-blue-50'
                    )}
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
