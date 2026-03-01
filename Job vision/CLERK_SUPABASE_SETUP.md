# 🔐 Clerk + Supabase Integration Guide

## ✅ What's Been Integrated

### 1. **Clerk Authentication**
- ✅ Installed `@clerk/clerk-react`
- ✅ Replaced custom auth with Clerk components
- ✅ Updated all pages to use Clerk hooks (`useUser`, `useAuth`)
- ✅ Protected routes now use Clerk's authentication
- ✅ Sign in/Sign up pages use Clerk components

### 2. **Supabase Database**
- ✅ Installed `@supabase/supabase-js`
- ✅ Created Supabase client configuration
- ✅ Created database query functions for all operations
- ✅ Updated all API calls to use Supabase
- ✅ Created TypeScript types for database schema

---

## 🚀 Setup Instructions

### Step 1: Set Up Clerk

1. **Create a Clerk Account**
   - Go to https://clerk.com
   - Sign up for a free account
   - Create a new application

2. **Get Your Publishable Key**
   - In Clerk Dashboard → API Keys
   - Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

3. **Configure Clerk in Your App**
   - Create `.env` file in `frontend/` folder
   - Add: `VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here`

4. **Configure Redirect URLs** (in Clerk Dashboard)
   - After Sign In: `http://localhost:5174/dashboard`
   - After Sign Up: `http://localhost:5174/onboarding`

---

### Step 2: Set Up Supabase

1. **Create a Supabase Account**
   - Go to https://supabase.com
   - Sign up for a free account
   - Create a new project

2. **Get Your Supabase Credentials**
   - In Supabase Dashboard → Settings → API
   - Copy your **Project URL**
   - Copy your **anon/public key**

3. **Configure Supabase in Your App**
   - Add to `.env` file:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key_here
     ```

4. **Create Database Tables**

Run these SQL commands in Supabase SQL Editor:

```sql
-- Job Intents Table
CREATE TABLE job_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  domain TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  location TEXT NOT NULL,
  job_type TEXT[] DEFAULT '{}',
  experience_level TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Job Signals Table
CREATE TABLE job_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL,
  source TEXT NOT NULL DEFAULT 'linkedin',
  status TEXT NOT NULL DEFAULT 'new',
  linkedin_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  job_signal_id UUID NOT NULL REFERENCES job_signals(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_job_intents_user_id ON job_intents(user_id);
CREATE INDEX idx_job_signals_user_id ON job_signals(user_id);
CREATE INDEX idx_job_signals_status ON job_signals(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);

-- Enable Row Level Security (RLS)
ALTER TABLE job_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (users can only access their own data)
CREATE POLICY "Users can view own job intents"
  ON job_intents FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own job intents"
  ON job_intents FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own job intents"
  ON job_intents FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own job signals"
  ON job_signals FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own job signals"
  ON job_signals FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own job signals"
  ON job_signals FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid()::text = user_id);
```

**Note**: Since we're using Clerk (not Supabase Auth), you'll need to adjust RLS policies. For now, you can:
- Option A: Disable RLS temporarily for development
- Option B: Use Supabase Service Role key for authenticated requests
- Option C: Create a custom auth function that validates Clerk tokens

---

### Step 3: Connect Clerk to Supabase

Since Clerk handles authentication separately, you have two options:

#### Option A: Use Clerk User ID Directly (Current Implementation)
- Clerk provides `user.id` which we use as `user_id` in Supabase
- RLS policies need to be adjusted to work with Clerk user IDs
- Simpler setup, but requires custom RLS logic

#### Option B: Sync Clerk Users to Supabase Auth
- Create a webhook in Clerk to sync users to Supabase Auth
- Use Supabase Auth for RLS policies
- More complex but better security

For now, **Option A** is implemented. You can add RLS later or use service role key.

---

## 📝 Environment Variables

Create `frontend/.env`:

```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🔄 What Changed

### Authentication
- ❌ Removed: Custom `AuthContext` and `AuthProvider`
- ✅ Added: Clerk `ClerkProvider` and hooks
- ✅ Updated: All pages use `useUser()` from Clerk
- ✅ Updated: Sign in/up pages use Clerk components

### Database
- ❌ Removed: Mock API and axios calls
- ✅ Added: Supabase client and query functions
- ✅ Updated: All API calls use Supabase queries
- ✅ Added: TypeScript types for database schema

### Components Updated
- `App.tsx` - Now uses `ClerkProvider`
- `ProtectedRoute.tsx` - Uses Clerk `useAuth()`
- `TopBar.tsx` - Uses Clerk `useUser()`
- `Sidebar.tsx` - Uses Clerk `signOut()`
- All pages - Use `useUser()` to get `user.id` for API calls

---

## 🧪 Testing

1. **Start the dev server:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Test Authentication:**
   - Go to `/sign-in`
   - Sign up with a new account
   - Should redirect to `/onboarding`

3. **Test Database:**
   - Fill onboarding form
   - Check Supabase dashboard to see data in `job_intents` table
   - Navigate to dashboard - should load stats from Supabase

---

## 🐛 Troubleshooting

### Clerk Issues
- **"Clerk Publishable Key is missing"**: Check `.env` file has `VITE_CLERK_PUBLISHABLE_KEY`
- **Redirect not working**: Configure redirect URLs in Clerk Dashboard

### Supabase Issues
- **"Supabase URL or Anon Key is missing"**: Check `.env` file
- **RLS Policy errors**: Temporarily disable RLS or adjust policies
- **Connection errors**: Check Supabase project is active

---

## 📚 Next Steps

1. ✅ Set up Clerk account and get publishable key
2. ✅ Set up Supabase project and create tables
3. ✅ Add environment variables
4. ✅ Test authentication flow
5. ✅ Test database operations
6. ⏭️ Set up webhooks for real-time updates (optional)
7. ⏭️ Add Clerk webhook to sync users to Supabase (optional)

---

**You're all set!** The frontend is now integrated with Clerk for authentication and Supabase for the database. 🎉
