import { useNavigate } from 'react-router-dom';
import { useJobIntent } from '@/hooks/useJobIntent';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/shared/ToastContainer';
import type { JobIntent } from '@/types';
import { ROUTES } from '@/config/constants';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { saveJobIntent } = useJobIntent();
  const { toasts, showToast, removeToast } = useToast();

  const handleSubmit = async (data: JobIntent) => {
    try {
      await saveJobIntent(data);
      showToast('Preferences saved successfully!', 'success');
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD);
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save preferences.';
      showToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <OnboardingWizard onSubmit={handleSubmit} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
