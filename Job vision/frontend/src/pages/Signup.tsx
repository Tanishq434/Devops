import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { APP_NAME } from '@/config/constants';
import { ROUTES } from '@/config/constants';

export const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-medium p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{APP_NAME}</h1>
            <p className="text-gray-600">Create your account</p>
          </div>
          <ClerkSignUp
            routing="path"
            path={ROUTES.SIGN_UP}
            signInUrl={ROUTES.SIGN_IN}
            appearance={{
              elements: {
                rootBox: 'mx-auto',
                card: 'shadow-none',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};
