import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { PasswordInput } from '../auth/PasswordInput';
import { JOB_ROLES, DOMAINS, COMMON_SKILLS, JOB_TYPES, EXPERIENCE_LEVELS } from '@/config/constants';
import type { JobIntent } from '@/types';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

const jobIntentSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  domain: z.string().min(1, 'Domain is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.array(z.string()).min(1, 'At least one job type is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
});

type JobIntentFormData = z.infer<typeof jobIntentSchema>;

interface JobPreferenceFormProps {
  initialData?: JobIntent;
  onSubmit: (data: JobIntent) => Promise<void>;
  isLoading?: boolean;
}

export const JobPreferenceForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: JobPreferenceFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobIntentFormData>({
    resolver: zodResolver(jobIntentSchema),
    defaultValues: initialData || {
      role: '',
      domain: '',
      skills: [],
      location: '',
      jobType: [],
      experienceLevel: '',
    },
  });

  const selectedSkills = watch('skills') || [];
  const selectedJobTypes = watch('jobType') || [];

  const toggleSkill = (skill: string) => {
    const current = selectedSkills;
    if (current.includes(skill)) {
      setValue('skills', current.filter((s) => s !== skill));
    } else {
      setValue('skills', [...current, skill]);
    }
  };

  const toggleJobType = (type: string) => {
    const current = selectedJobTypes;
    if (current.includes(type)) {
      setValue('jobType', current.filter((t) => t !== type));
    } else {
      setValue('jobType', [...current, type]);
    }
  };

  const handleFormSubmit = async (data: JobIntentFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Desired Role *
        </label>
        <select
          {...register('role')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a role</option>
          {JOB_ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Domain *
        </label>
        <select
          {...register('domain')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a domain</option>
          {DOMAINS.map((domain) => (
            <option key={domain} value={domain}>
              {domain}
            </option>
          ))}
        </select>
        {errors.domain && (
          <p className="mt-1 text-sm text-red-600">{errors.domain.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills * (Select all that apply)
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SKILLS.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                selectedSkills.includes(skill)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {skill}
            </button>
          ))}
        </div>
        {selectedSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {errors.skills && (
          <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
        )}
      </div>

      <div>
        <Input
          label="Location *"
          {...register('location')}
          error={errors.location?.message}
          placeholder="e.g., Remote, San Francisco, CA"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Job Type * (Select all that apply)
        </label>
        <div className="space-y-2">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedJobTypes.includes(type)}
                onChange={() => toggleJobType(type)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
        {errors.jobType && (
          <p className="mt-1 text-sm text-red-600">{errors.jobType.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Experience Level *
        </label>
        <div className="space-y-2">
          {EXPERIENCE_LEVELS.map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value={level}
                {...register('experienceLevel')}
                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
              />
              <span className="text-gray-700">{level}</span>
            </label>
          ))}
        </div>
        {errors.experienceLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.experienceLevel.message}</p>
        )}
      </div>

      <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
        Save Preferences
      </Button>
    </form>
  );
};
