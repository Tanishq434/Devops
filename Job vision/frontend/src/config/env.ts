// Environment Variables Configuration

export const env = {
  clerk: {
    publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
} as const;

// Validation
if (!env.clerk.publishableKey) {
  console.warn(
    'Clerk Publishable Key is missing. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file'
  );
}

if (!env.supabase.url || !env.supabase.anonKey) {
  console.warn(
    'Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file'
  );
}
