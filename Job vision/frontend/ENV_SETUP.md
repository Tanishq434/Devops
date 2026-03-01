# Environment Variables Setup

Create a `.env` file in the `frontend/` folder with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here

# Supabase Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## How to Get Your Keys

### Clerk Publishable Key
1. Go to https://clerk.com and sign up
2. Create a new application
3. Go to API Keys section
4. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### Supabase Credentials
1. Go to https://supabase.com and sign up
2. Create a new project
3. Go to Settings → API
4. Copy the **Project URL** and **anon/public key**

---

**Note**: Never commit your `.env` file to git! It's already in `.gitignore`.
