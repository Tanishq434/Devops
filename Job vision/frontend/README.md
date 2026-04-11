# Smart Job Signal

A modern, API-driven job discovery and redirection platform that helps job seekers discover highly relevant job opportunities without manually scrolling through noisy job feeds.

## Features

- **User Authentication**: Secure signup and login with session management
- **Job Intent Configuration**: Define your job preferences once (role, domain, skills, location, etc.)
- **Job Signal Discovery**: Automatically discover new relevant job opportunities
- **Real-time Notifications**: Get notified when new jobs match your preferences
- **Job Tracking**: Mark jobs as viewed, applied, or ignored
- **Dashboard**: Overview of your job search activity and statistics
- **Activity Timeline**: Track all your job search interactions

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Form Management**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK_API=true
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── auth/         # Authentication components
│   ├── dashboard/    # Dashboard-specific components
│   ├── jobs/         # Job-related components
│   ├── layout/       # Layout components (Sidebar, TopBar, etc.)
│   ├── onboarding/  # Onboarding flow components
│   └── shared/       # Shared components (Button, Card, etc.)
├── context/          # React Context providers
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── services/         # API service layer
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## API Integration

The application uses a mock API by default (when `VITE_USE_MOCK_API=true`). To connect to a real backend:

1. Set `VITE_USE_MOCK_API=false` in your `.env` file
2. Update `VITE_API_BASE_URL` to point to your backend API
3. Ensure your backend implements the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### User Preferences
- `GET /user/intent` - Get user job intent
- `PUT /user/intent` - Update user job intent

### Job Signals
- `GET /jobs/signals` - Get all job signals
- `POST /jobs/:id/view` - Mark job as viewed
- `POST /jobs/:id/apply` - Mark job as applied
- `POST /jobs/:id/ignore` - Mark job as ignored

### Notifications
- `GET /notifications` - Get user notifications

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

## Features in Detail

### Authentication
- Email/password authentication
- Form validation with Zod
- Secure session handling
- Protected routes

### Job Intent Setup
- Multi-step onboarding wizard
- Role selection
- Domain selection
- Skills multi-select
- Location input
- Job type selection
- Experience level selection

### Dashboard
- Real-time statistics (new jobs, viewed, applied, last signal)
- Recent job signals preview
- Quick navigation to job signals

### Job Signals
- Filter by status (new, viewed, applied, ignored)
- Filter by date range
- Mark jobs as viewed/applied/ignored
- Direct links to LinkedIn job posts
- Visual indicators for new and applied jobs

### Notifications
- Real-time notification badge
- Dropdown notification list
- Click to view job on LinkedIn

## Development

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for code formatting (recommended)

### Environment Variables
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_USE_MOCK_API`: Use mock API (true/false)

## License

MIT
