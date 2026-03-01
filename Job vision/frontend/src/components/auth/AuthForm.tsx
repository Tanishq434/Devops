import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { PasswordInput } from './PasswordInput';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (data: LoginFormData | SignupFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export const AuthForm = ({ mode, onSubmit, isLoading = false }: AuthFormProps) => {
  const schema = mode === 'login' ? loginSchema : signupSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | SignupFormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data: LoginFormData | SignupFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      // Error is handled in the parent component
      console.error('Form submit error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {mode === 'signup' && (
        <Input
          label="Name"
          {...register('name')}
          error={(errors as any).name?.message}
          placeholder="Enter your name"
        />
      )}
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        placeholder="Enter your email"
      />
      <PasswordInput
        label="Password"
        {...register('password')}
        error={errors.password?.message}
        placeholder="Enter your password"
      />
      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        {mode === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
};
