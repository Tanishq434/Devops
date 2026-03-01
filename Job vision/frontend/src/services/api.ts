// This file is deprecated - use domain services and hooks instead
// Kept for backward compatibility during migration

// Re-export services for backward compatibility
export { jobIntentService as userAPI } from '@/domain/services/job-intent.service';
export { jobSignalService as jobsAPI } from '@/domain/services/job-signal.service';
export { notificationService as notificationsAPI } from '@/domain/services/notification.service';
export { dashboardService as dashboardAPI } from '@/domain/services/dashboard.service';
