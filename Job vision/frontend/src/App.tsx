import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { JobSignals } from './pages/JobSignals';
import { Preferences } from './pages/Preferences';
import { Activity } from './pages/Activity';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

if (!clerkPubKey) {
  console.warn('Clerk Publishable Key is missing. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file');
}

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={env.clerk.publishableKey}>
        <BrowserRouter>
          <Routes>
            <Route path={ROUTES.SIGN_IN + '/*'} element={<SignIn />} />
            <Route path={ROUTES.SIGN_UP + '/*'} element={<SignUp />} />
            <Route
              path={ROUTES.ONBOARDING}
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.JOBS}
              element={
                <ProtectedRoute>
                  <Layout>
                    <JobSignals />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PREFERENCES}
              element={
                <ProtectedRoute>
                  <Layout>
                    <Preferences />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ACTIVITY}
              element={
                <ProtectedRoute>
                  <Layout>
                    <Activity />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
