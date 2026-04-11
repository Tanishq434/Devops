import { useEffect, useState } from 'react';
import { useJobIntent } from '@/hooks/useJobIntent';
import type { JobIntent } from '@/types';
import { JobPreferenceForm } from '@/components/onboarding/JobPreferenceForm';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/shared/ToastContainer';
import { Card } from '@/components/shared/Card';

export const Preferences = () => {
  const { getJobIntent, saveJobIntent, isLoading, error } = useJobIntent();
  const [intent, setIntent] = useState<JobIntent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchIntent = async () => {
      try {
        const data = await getJobIntent();
        setIntent(data);
      } catch (err) {
        showToast('Failed to load preferences', 'error');
      }
    };

    fetchIntent();
  }, [getJobIntent, showToast]);

  const handleSubmit = async (data: JobIntent) => {
    setIsSaving(true);
    try {
      const saved = await saveJobIntent(data);
      setIntent(saved);
      showToast('Preferences updated successfully!', 'success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update preferences';
      showToast(message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-soft p-8 animate-pulse">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="space-y-2">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Preferences</h1>
        <p className="text-gray-600">
          Update your job preferences to receive more relevant job signals.
        </p>
      </div>

      <Card>
        <JobPreferenceForm
          initialData={intent || undefined}
          onSubmit={handleSubmit}
          isLoading={isSaving}
        />
      </Card>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};
