// Database Client - Single source of truth for Supabase connection

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { env } from '@/config/env';

if (!env.supabase.url || !env.supabase.anonKey) {
  console.warn(
    'Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
  );
}

export const supabase = createClient<Database>(
  env.supabase.url || 'https://placeholder.supabase.co',
  env.supabase.anonKey || 'placeholder-key',
  {
    auth: {
      persistSession: false, // Clerk handles auth
    },
  }
);
