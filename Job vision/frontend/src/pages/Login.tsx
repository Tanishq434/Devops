import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData | { email: string; password: string; name?: string }) => {
    const loginData = data as LoginFormData;
    try {
      setIsLoading(true);
      await login(loginData.email, loginData.password);
      showToast('Login successful!', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-medium p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Job Signal</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          <AuthForm mode="login" onSubmit={handleSubmit} isLoading={isLoading} />
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
