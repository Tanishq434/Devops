# 🏗️ Architecture Documentation

## Overview

This project follows a **clean architecture** pattern with clear separation of concerns, making it scalable, maintainable, and testable.

---

## 📁 Project Structure

```
frontend/src/
├── config/              # Configuration and constants
│   ├── constants.ts     # Application constants
│   └── env.ts          # Environment variables
│
├── core/                # Core infrastructure
│   ├── database/       # Database layer
│   │   ├── client.ts   # Supabase client
│   │   ├── mappers.ts  # Entity mappers
│   │   └── error-handler.ts
│   └── errors/         # Custom error classes
│       └── AppError.ts
│
├── domain/              # Business logic layer
│   ├── repositories/   # Data access layer
│   │   ├── job-intent.repository.ts
│   │   ├── job-signal.repository.ts
│   │   └── notification.repository.ts
│   └── services/       # Business logic
│       ├── job-intent.service.ts
│       ├── job-signal.service.ts
│       ├── dashboard.service.ts
│       └── notification.service.ts
│
├── hooks/              # Custom React hooks
│   ├── useJobIntent.ts
│   ├── useJobSignals.ts
│   ├── useDashboardStats.ts
│   └── useNotifications.ts
│
├── components/         # UI components (presentation)
│   ├── auth/
│   ├── dashboard/
│   ├── jobs/
│   ├── layout/
│   ├── onboarding/
│   └── shared/
│
├── pages/             # Page components (orchestration)
│
├── types/             # TypeScript types
│   ├── index.ts      # Domain types
│   └── database.ts   # Database types
│
└── utils/             # Pure utility functions
    ├── cn.ts         # Class name utility
    ├── date.ts       # Date utilities
    ├── validation.ts # Validation utilities
    └── filter.ts     # Filter utilities
```

---

## 🎯 Architecture Principles

### 1. **Separation of Concerns**
- **Config**: Environment variables and constants
- **Core**: Infrastructure (database, errors)
- **Domain**: Business logic (repositories, services)
- **Hooks**: Data fetching and state management
- **Components**: Presentation only
- **Pages**: Orchestration
- **Utils**: Pure functions

### 2. **Single Responsibility Principle**
Each module/function does **one thing** and does it well:
- **Repositories**: Only data access
- **Services**: Only business logic
- **Hooks**: Only data fetching/state
- **Components**: Only UI rendering
- **Utils**: Only pure transformations

### 3. **Dependency Inversion**
- High-level modules (services) don't depend on low-level modules (repositories)
- Both depend on abstractions (interfaces/types)
- Easy to swap implementations (e.g., mock for testing)

### 4. **Error Handling**
- Centralized error handling in `core/database/error-handler.ts`
- Custom error classes in `core/errors/`
- Consistent error propagation

---

## 🔄 Data Flow

```
User Action
    ↓
Page Component
    ↓
Custom Hook (useJobSignals, etc.)
    ↓
Domain Service (jobSignalService)
    ↓
Repository (jobSignalRepository)
    ↓
Database Client (supabase)
    ↓
Supabase Database
```

### Example: Fetching Job Signals

1. **Page** (`JobSignals.tsx`) calls `useJobSignals()` hook
2. **Hook** (`useJobSignals.ts`) calls `jobSignalService.getJobSignals()`
3. **Service** (`job-signal.service.ts`) validates input and calls repository
4. **Repository** (`job-signal.repository.ts`) queries database
5. **Database Client** (`client.ts`) executes Supabase query
6. **Mapper** (`mappers.ts`) transforms database entity to domain model
7. Data flows back up through the layers

---

## 📦 Layer Responsibilities

### **Config Layer**
- **Purpose**: Application configuration
- **Files**: `constants.ts`, `env.ts`
- **Responsibilities**:
  - Environment variables
  - Application constants
  - Route definitions
  - Validation of config

### **Core Layer**
- **Purpose**: Infrastructure and foundation
- **Files**: `database/`, `errors/`
- **Responsibilities**:
  - Database client setup
  - Error handling
  - Entity mapping
  - Low-level utilities

### **Domain Layer**
- **Purpose**: Business logic
- **Files**: `repositories/`, `services/`
- **Responsibilities**:
  - Data access (repositories)
  - Business rules (services)
  - Validation
  - Data transformation

### **Hooks Layer**
- **Purpose**: React-specific data fetching
- **Files**: `hooks/*.ts`
- **Responsibilities**:
  - Fetching data
  - Managing loading/error states
  - Exposing data to components

### **Components Layer**
- **Purpose**: UI presentation
- **Files**: `components/**/*.tsx`
- **Responsibilities**:
  - Rendering UI
  - User interactions
  - No business logic

### **Pages Layer**
- **Purpose**: Page orchestration
- **Files**: `pages/*.tsx`
- **Responsibilities**:
  - Composing components
  - Using hooks
  - Page-level logic

### **Utils Layer**
- **Purpose**: Pure utility functions
- **Files**: `utils/*.ts`
- **Responsibilities**:
  - Date formatting
  - Validation
  - Filtering
  - No side effects

---

## 🔒 Error Handling Strategy

### Error Types
1. **AppError**: Base error class
2. **DatabaseError**: Database operation failures
3. **ValidationError**: Input validation failures
4. **NotFoundError**: Resource not found
5. **UnauthorizedError**: Authentication failures

### Error Flow
```
Database Error
    ↓
Error Handler (transforms to AppError)
    ↓
Repository (throws AppError)
    ↓
Service (may wrap or rethrow)
    ↓
Hook (catches and sets error state)
    ↓
Component (displays error to user)
```

---

## 🧪 Testing Strategy

### Unit Tests
- **Utils**: Test pure functions
- **Services**: Test business logic with mocked repositories
- **Repositories**: Test with mocked database client

### Integration Tests
- **Hooks**: Test with real services
- **Components**: Test with React Testing Library

### E2E Tests
- **Pages**: Test full user flows

---

## 📝 Code Organization Rules

### 1. **One Function, One Responsibility**
```typescript
// ❌ Bad: Multiple responsibilities
function processUser(user: User) {
  validateUser(user);
  saveToDatabase(user);
  sendEmail(user);
  logActivity(user);
}

// ✅ Good: Single responsibility
function validateUser(user: User): void { ... }
function saveUser(user: User): Promise<User> { ... }
function sendWelcomeEmail(user: User): Promise<void> { ... }
```

### 2. **Pure Functions in Utils**
```typescript
// ✅ Good: Pure function, no side effects
export const formatTimeAgo = (dateString: string): string => {
  // Only transforms input to output
}

// ❌ Bad: Side effects in utility
export const formatTimeAgo = (dateString: string): string => {
  console.log('Formatting...'); // Side effect!
  // ...
}
```

### 3. **Services Handle Business Logic**
```typescript
// ✅ Good: Service validates and orchestrates
class JobSignalService {
  async updateStatus(id: string, userId: string, status: JobStatus) {
    this.validateInput(id, userId, status); // Business rule
    return await repository.update(id, userId, status); // Data access
  }
}
```

### 4. **Repositories Only Access Data**
```typescript
// ✅ Good: Repository only does data access
class JobSignalRepository {
  async findByUserId(userId: string): Promise<JobSignal[]> {
    // Only database operations
    return await supabase.from('job_signals').select('*').eq('user_id', userId);
  }
}
```

---

## 🚀 Adding New Features

### Step 1: Define Types
Add types to `types/index.ts`

### Step 2: Create Repository
Create `domain/repositories/feature.repository.ts` for data access

### Step 3: Create Service
Create `domain/services/feature.service.ts` for business logic

### Step 4: Create Hook
Create `hooks/useFeature.ts` for React integration

### Step 5: Create Components
Create UI components in `components/`

### Step 6: Create Page
Create page in `pages/` that uses the hook and components

---

## 📚 Best Practices

1. **Always use TypeScript types** - No `any` types
2. **Handle errors properly** - Use custom error classes
3. **Validate inputs** - In services, not components
4. **Keep components pure** - No business logic in components
5. **Use hooks for data** - Don't fetch data directly in components
6. **One file, one responsibility** - Keep files focused
7. **Export what's needed** - Don't export internal helpers
8. **Document complex logic** - Add comments for non-obvious code

---

## 🔄 Migration Notes

Old files are kept for backward compatibility:
- `lib/supabase-queries.ts` → Use repositories
- `services/api.ts` → Use services directly
- `lib/supabase.ts` → Use `core/database/client.ts`

These will be removed in a future update.
