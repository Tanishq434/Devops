# 🏗️ Architecture Overview

## 📐 Clean Architecture Principles

This project follows **Clean Architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Components)                     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Application Layer                │
│  (Hooks - React-specific logic)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Domain Layer                    │
│  (Services - Business Logic)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Data Layer                      │
│  (Repositories - Data Access)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Infrastructure Layer            │
│  (Database Client, Error Handling)      │
└─────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
src/
├── config/              # Configuration
│   ├── constants.ts     # App constants (routes, roles, etc.)
│   └── env.ts          # Environment variables
│
├── core/                # Core infrastructure
│   ├── database/        # Database layer
│   │   ├── client.ts    # Supabase client (single instance)
│   │   ├── mappers.ts   # Entity mappers (DB ↔ Domain)
│   │   └── error-handler.ts  # Database error handling
│   └── errors/          # Custom error classes
│       └── AppError.ts
│
├── domain/              # Business logic
│   ├── repositories/    # Data access (Repository pattern)
│   │   ├── job-intent.repository.ts
│   │   ├── job-signal.repository.ts
│   │   └── notification.repository.ts
│   └── services/        # Business logic
│       ├── job-intent.service.ts
│       ├── job-signal.service.ts
│       ├── dashboard.service.ts
│       └── notification.service.ts
│
├── hooks/               # React hooks (data fetching)
│   ├── useJobIntent.ts
│   ├── useJobSignals.ts
│   ├── useDashboardStats.ts
│   └── useNotifications.ts
│
├── components/          # UI components (presentation only)
│   ├── auth/
│   ├── dashboard/
│   ├── jobs/
│   ├── layout/
│   ├── onboarding/
│   └── shared/
│
├── pages/              # Page components (orchestration)
│
├── types/              # TypeScript types
│   ├── index.ts        # Domain types
│   └── database.ts     # Database schema types
│
└── utils/              # Pure utility functions
    ├── cn.ts           # Class name utility
    ├── date.ts         # Date formatting
    ├── validation.ts    # Validation functions
    └── filter.ts       # Filtering utilities
```

---

## 🔄 Data Flow Example

### Fetching Job Signals

```
1. User clicks "Job Signals" in sidebar
   ↓
2. Page Component (JobSignals.tsx)
   - Calls useJobSignals() hook
   ↓
3. Hook (useJobSignals.ts)
   - Gets user ID from Clerk
   - Calls jobSignalService.getJobSignals(userId)
   - Manages loading/error state
   ↓
4. Service (job-signal.service.ts)
   - Validates userId
   - Calls jobSignalRepository.findByUserId(userId)
   ↓
5. Repository (job-signal.repository.ts)
   - Queries Supabase database
   - Maps database entities to domain models
   ↓
6. Database Client (client.ts)
   - Executes Supabase query
   ↓
7. Data flows back up through layers
   - Repository → Service → Hook → Component
   - Component renders job signals
```

---

## 🎯 Key Principles

### 1. **Single Responsibility**
Each module/function does ONE thing:
- ✅ Repository: Only data access
- ✅ Service: Only business logic
- ✅ Hook: Only data fetching/state
- ✅ Component: Only UI rendering
- ✅ Util: Only pure transformations

### 2. **Dependency Direction**
Dependencies flow inward:
- Components depend on Hooks
- Hooks depend on Services
- Services depend on Repositories
- Repositories depend on Database Client

**Never:**
- ❌ Service depends on Component
- ❌ Repository depends on Service
- ❌ Component directly calls Repository

### 3. **Separation of Concerns**
- **Data Access** → Repositories
- **Business Rules** → Services
- **UI Logic** → Hooks
- **Presentation** → Components
- **Utilities** → Utils

### 4. **Error Handling**
- Custom error classes in `core/errors/`
- Centralized error handling in `core/database/error-handler.ts`
- Errors propagate up through layers
- Components handle errors for user display

---

## 📝 Code Examples

### ✅ Good: Proper Separation

```typescript
// Repository: Only data access
class JobSignalRepository {
  async findByUserId(userId: string): Promise<JobSignal[]> {
    const { data } = await supabase.from('job_signals').select('*');
    return data.map(mapJobSignalFromDb);
  }
}

// Service: Only business logic
class JobSignalService {
  async getJobSignals(userId: string): Promise<JobSignal[]> {
    if (!userId) throw new ValidationError('User ID required');
    return await repository.findByUserId(userId);
  }
}

// Hook: Only data fetching
export const useJobSignals = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    if (!user?.id) return;
    jobSignalService.getJobSignals(user.id).then(setJobs);
  }, [user?.id]);
  
  return { jobs };
};

// Component: Only UI
export const JobSignals = () => {
  const { jobs } = useJobSignals();
  return <div>{jobs.map(job => <JobCard key={job.id} job={job} />)}</div>;
};
```

### ❌ Bad: Mixed Concerns

```typescript
// ❌ Component doing everything
export const JobSignals = () => {
  const [jobs, setJobs] = useState([]);
  
  useEffect(() => {
    // Direct database call in component
    supabase.from('job_signals').select('*').then(({ data }) => {
      // Business logic in component
      const filtered = data.filter(job => job.status === 'new');
      setJobs(filtered);
    });
  }, []);
  
  // Formatting logic in component
  const formatDate = (date) => { /* ... */ };
  
  return <div>...</div>;
};
```

---

## 🧪 Testing Strategy

### Unit Tests
- **Utils**: Test pure functions
- **Services**: Mock repositories, test business logic
- **Repositories**: Mock database client, test queries

### Integration Tests
- **Hooks**: Test with real services
- **Components**: Test with React Testing Library

### E2E Tests
- **Pages**: Test full user flows

---

## 🚀 Adding New Features

### Step-by-Step Guide

1. **Define Types** (`types/index.ts`)
   ```typescript
   export interface NewFeature {
     id: string;
     name: string;
   }
   ```

2. **Create Repository** (`domain/repositories/new-feature.repository.ts`)
   ```typescript
   export class NewFeatureRepository {
     async findAll(): Promise<NewFeature[]> {
       // Data access only
     }
   }
   ```

3. **Create Service** (`domain/services/new-feature.service.ts`)
   ```typescript
   export class NewFeatureService {
     async getFeatures(): Promise<NewFeature[]> {
       // Business logic + validation
       return await repository.findAll();
     }
   }
   ```

4. **Create Hook** (`hooks/useNewFeature.ts`)
   ```typescript
   export const useNewFeature = () => {
     const { getFeatures } = newFeatureService;
     // React-specific logic
   }
   ```

5. **Create Component** (`components/new-feature/FeatureCard.tsx`)
   ```typescript
   export const FeatureCard = ({ feature }) => {
     // UI only
   }
   ```

6. **Create Page** (`pages/Features.tsx`)
   ```typescript
   export const Features = () => {
     const { features } = useNewFeature();
     return <div>{features.map(f => <FeatureCard key={f.id} feature={f} />)}</div>;
   }
   ```

---

## 📊 Benefits

1. **Scalability**: Easy to add new features
2. **Maintainability**: Clear structure, easy to find code
3. **Testability**: Each layer can be tested independently
4. **Readability**: Self-documenting code structure
5. **Reusability**: Hooks, services, utils can be reused
6. **Type Safety**: Full TypeScript support
7. **Error Handling**: Centralized and consistent

---

## 🔍 File Naming Conventions

- **Repositories**: `*.repository.ts`
- **Services**: `*.service.ts`
- **Hooks**: `use*.ts`
- **Components**: `*.tsx` (PascalCase)
- **Utils**: `*.ts` (camelCase)
- **Types**: `*.ts` (PascalCase interfaces)

---

## ✅ Best Practices

1. ✅ One function = One responsibility
2. ✅ Pure functions in utils (no side effects)
3. ✅ Services validate inputs
4. ✅ Repositories only access data
5. ✅ Components only render UI
6. ✅ Hooks manage React state
7. ✅ Use TypeScript types everywhere
8. ✅ Handle errors properly
9. ✅ Use constants from config
10. ✅ Document complex logic

---

**This architecture ensures the codebase is scalable, maintainable, and follows industry best practices!** 🎉
