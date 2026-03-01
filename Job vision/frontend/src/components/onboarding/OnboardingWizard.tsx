import { useState } from 'react';
import { StepIndicator } from './StepIndicator';
import { JobPreferenceForm } from './JobPreferenceForm';
import type { JobIntent } from '@/types';

interface OnboardingWizardProps {
  onSubmit: (data: JobIntent) => Promise<void>;
}

export const OnboardingWizard = ({ onSubmit }: OnboardingWizardProps) => {
  const [currentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 1; // Single step for now, but can be extended

  const handleSubmit = async (data: JobIntent) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Set Up Your Job Preferences
        </h1>
        <p className="text-gray-600">
          Tell us what you're looking for, and we'll find the perfect opportunities for you.
        </p>
      </div>

      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <div className="bg-white rounded-lg shadow-medium p-8">
        <JobPreferenceForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};
