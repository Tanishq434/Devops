# 🎬 Smart Job Signal - Demo Guide

## 🚀 Quick Start

The development server should be running at:
**http://localhost:5173**

---

## 📱 Demo Walkthrough

### Step 1: Login/Signup Page
- **URL**: `http://localhost:5173/login` or `http://localhost:5173/signup`
- **What you'll see**:
  - Clean, centered white card on gray background
  - "Smart Job Signal" branding
  - Email and password fields
  - Form validation (try invalid email to see error)
  - Link to switch between login/signup

**Try it**: 
- Click "Sign up" or go to `/signup`
- Enter any email (e.g., `demo@example.com`)
- Enter password (min 6 characters, e.g., `password123`)
- Enter name (min 2 characters, e.g., `John Doe`)
- Click "Sign Up"

---

### Step 2: Onboarding (Job Preferences)
- **URL**: `http://localhost:5173/onboarding`
- **What you'll see**:
  - Step indicator at top
  - Form with all job preference fields:
    - **Role**: Dropdown (Cloud Engineer, Backend Engineer, etc.)
    - **Domain**: Dropdown (Computer / IT, Finance, etc.)
    - **Skills**: Multi-select chips (AWS, Docker, Kubernetes, etc.)
    - **Location**: Text input
    - **Job Type**: Checkboxes (Full-time, Part-time, etc.)
    - **Experience Level**: Radio buttons (Student, Entry, Mid-level, etc.)

**Try it**:
- Fill in all fields
- Select multiple skills by clicking chips
- Click "Save Preferences"
- You'll be redirected to Dashboard

---

### Step 3: Dashboard (Main Screen)
- **URL**: `http://localhost:5173/dashboard`
- **What you'll see**:
  - **Top Bar**: User profile (avatar + name/email) + notification bell
  - **Sidebar**: Navigation menu (Dashboard, Job Signals, Preferences, Activity, Logout)
  - **Main Content**:
    - 4 stat cards showing:
      - New Jobs Today: 5
      - Jobs Viewed: 12
      - Jobs Applied: 3
      - Last Signal: Just now
    - Recent Job Signals section with preview cards

**Try it**:
- Click on any stat card
- Click "View All" in Recent Jobs section
- Click notification bell to see notifications
- Navigate using sidebar

---

### Step 4: Job Signals Page
- **URL**: `http://localhost:5173/jobs`
- **What you'll see**:
  - Filter bar at top (Status: All/New/Viewed/Applied/Ignored, Date Range)
  - Job cards showing:
    - Job title (bold, large)
    - Company name
    - Location
    - Source badge (LinkedIn)
    - Time detected ("2 hours ago")
    - Action buttons:
      - "View on LinkedIn" (primary, blue)
      - "Mark as Applied"
      - "Ignore"
  - New jobs have blue highlight ring
  - Applied jobs are faded

**Try it**:
- Filter by status (click "new", "applied", etc.)
- Click "View on LinkedIn" (opens in new tab)
- Mark a job as "Applied" (see toast notification)
- Ignore a job (it disappears)
- Try different date filters

---

### Step 5: Preferences Page
- **URL**: `http://localhost:5173/preferences`
- **What you'll see**:
  - Same form as onboarding
  - Pre-filled with your current preferences
  - Save button to update

**Try it**:
- Change your role or skills
- Click "Save Preferences"
- See success toast
- Changes immediately affect job signals

---

### Step 6: Activity Page
- **URL**: `http://localhost:5173/activity`
- **What you'll see**:
  - Timeline of all your job interactions
  - Each job shows:
    - Status icon (eye for viewed, checkmark for applied, X for ignored)
    - Job title and company
    - Status badge
    - Timestamp
    - Source badge

**Try it**:
- Scroll through your activity history
- See all jobs you've interacted with

---

## 🎨 Design Features to Notice

1. **Clean, Modern UI**:
   - Soft shadows on cards
   - Rounded corners
   - Smooth hover effects
   - Professional color scheme (blue primary, gray neutrals)

2. **Responsive Design**:
   - Resize browser window
   - Sidebar collapses to hamburger menu on mobile
   - Cards stack vertically on small screens

3. **Interactive Elements**:
   - Hover effects on buttons and cards
   - Loading states (spinner on buttons)
   - Toast notifications (bottom-right)
   - Smooth transitions

4. **User Experience**:
   - Form validation with error messages
   - Protected routes (try accessing `/dashboard` without login)
   - Auto-redirects after actions
   - Clear navigation

---

## 🔍 Things to Test

### Authentication Flow
1. Try logging in with wrong credentials
2. Sign up with invalid email format
3. Sign up with short password (< 6 chars)
4. Complete signup → should go to onboarding

### Navigation
1. Click all sidebar links
2. Use browser back/forward buttons
3. Try accessing protected routes directly (should redirect to login)

### Job Signals
1. Filter by different statuses
2. Mark jobs as applied/ignored
3. Click "View on LinkedIn" (opens external link)
4. Try filtering by date range

### Notifications
1. Click notification bell
2. See unread count badge
3. Click on a notification (should open LinkedIn)

### Responsive
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on mobile view (375px width)
4. See sidebar collapse to hamburger menu

---

## 🐛 Mock Data

The app uses mock data, so:
- All API calls return immediately
- No real backend connection needed
- Data persists in localStorage
- You can sign up with any email/password

---

## 📸 Key Screenshots Locations

1. **Login Page**: `/login` - Centered card, clean design
2. **Dashboard**: `/dashboard` - Stats + recent jobs
3. **Job Signals**: `/jobs` - List of job cards with filters
4. **Preferences**: `/preferences` - Form to edit job intent
5. **Activity**: `/activity` - Timeline view

---

## 🚀 Next Steps

Once you've tested the frontend:
1. Connect to real backend (set `VITE_USE_MOCK_API=false` in `.env`)
2. Update API endpoints in `frontend/src/services/api.ts`
3. Deploy to production

---

**Enjoy exploring the Smart Job Signal frontend! 🎉**
