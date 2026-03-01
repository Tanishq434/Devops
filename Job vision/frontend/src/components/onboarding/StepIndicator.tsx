import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const step = index + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                  isCompleted && 'bg-accent text-white',
                  isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                  !isCompleted && !isCurrent && 'bg-gray-200 text-gray-600'
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : step}
              </div>
              <span className="mt-2 text-xs text-gray-600">Step {step}</span>
            </div>
            {step < totalSteps && (
              <div
                className={cn(
                  'w-16 h-1 mx-2 transition-colors',
                  isCompleted ? 'bg-accent' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
