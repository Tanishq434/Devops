import { useUser } from '@clerk/clerk-react';
import { NotificationDropdown } from './NotificationDropdown';

export const TopBar = () => {
  const { user } = useUser();

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.fullName || user?.firstName || 'User'}
            </p>
            <p className="text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            {getUserInitial(user)}
          </div>
        </div>
      </div>
    </div>
  );
};
