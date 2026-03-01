// This file is deprecated - use repositories and services instead
// Kept for backward compatibility during migration

// Import from new architecture
export { jobIntentRepository as jobIntentQueries } from '@/domain/repositories/job-intent.repository';
export { jobSignalRepository as jobSignalQueries } from '@/domain/repositories/job-signal.repository';
export { notificationRepository as notificationQueries } from '@/domain/repositories/notification.repository';
export { dashboardService as dashboardQueries } from '@/domain/services/dashboard.service';
