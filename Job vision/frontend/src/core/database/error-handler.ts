// Database Error Handler - Centralized error handling for database operations

import { DatabaseError, NotFoundError } from '@/core/errors/AppError';
import type { PostgrestError } from '@supabase/supabase-js';

export const handleDatabaseError = (error: PostgrestError | Error): never => {
  if ('code' in error) {
    const pgError = error as PostgrestError;
    
    // Handle specific Supabase/Postgres error codes
    if (pgError.code === 'PGRST116') {
      throw new NotFoundError('Resource not found');
    }
    
    if (pgError.code === '23505') {
      throw new DatabaseError('Duplicate entry', pgError.code);
    }
    
    throw new DatabaseError(pgError.message || 'Database operation failed', pgError.code);
  }
  
  throw new DatabaseError(error.message || 'Database operation failed');
};
