// Application Constants

export const APP_NAME = 'Smart Job Signal';

export const ROUTES = {
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ONBOARDING: '/onboarding',
  DASHBOARD: '/dashboard',
  JOBS: '/jobs',
  PREFERENCES: '/preferences',
  ACTIVITY: '/activity',
} as const;

export const JOB_ROLES = [
  'Cloud Engineer',
  'Backend Engineer',
  'DevOps Engineer',
  'Data Engineer',
  'Frontend Engineer',
  'Full Stack Engineer',
  'Software Engineer',
] as const;

export const DOMAINS = [
  'Computer / IT',
  'Finance',
  'Healthcare',
  'Education',
  'Other',
] as const;

export const COMMON_SKILLS = [
  'AWS',
  'Docker',
  'Kubernetes',
  'Python',
  'Java',
  'JavaScript',
  'React',
  'Node.js',
  'PostgreSQL',
  'MongoDB',
  'Terraform',
  'CI/CD',
] as const;

export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship'] as const;

export const EXPERIENCE_LEVELS = ['Student', 'Entry', 'Mid-level', 'Senior', 'Lead'] as const;

export const JOB_STATUS = ['new', 'viewed', 'applied', 'ignored'] as const;

export const DATE_FILTERS = {
  ALL: 'all',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
} as const;

export const NOTIFICATION_POLL_INTERVAL = 30000; // 30 seconds
