import type { ReactNode } from 'react';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
};
