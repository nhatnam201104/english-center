# Zustand Auth Store

This folder contains Zustand stores for application state management.

## Auth Store (`auth.store.ts`)

The auth store manages user authentication state using Zustand with persistence.

### State

- `user`: User object containing user information (or null if not logged in)
- `token`: JWT token for API authentication (or null if not logged in)
- `isAuthenticated`: Boolean flag indicating if user is logged in

### Actions

- `setAuth(user, token)`: Set user data and token on successful login
- `logout()`: Clear all auth data and set isAuthenticated to false
- `updateUser(user)`: Update partial user information

### Usage Examples

#### Accessing Auth State

```typescript
import { useAuthStore } from '@/stores/auth.store';

function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <div>Welcome, {user?.fullName}</div>;
  }
  
  return <div>Please login</div>;
}
```

#### Setting Auth Data (Login)

```typescript
import { useAuthStore } from '@/stores/auth.store';

function handleLogin(userResponse, token) {
  const setAuth = useAuthStore.getState().setAuth;
  setAuth(userResponse, token);
}
```

#### Logging Out

```typescript
import { useAuthStore } from '@/stores/auth.store';

function handleLogout() {
  const logout = useAuthStore.getState().logout;
  logout();
}
```

#### Updating User Data

```typescript
import { useAuthStore } from '@/stores/auth.store';

function updateUserProfile(newData) {
  const updateUser = useAuthStore.getState().updateUser;
  updateUser({ fullName: newData.fullName, phone: newData.phone });
}
```

### Persistence

The auth store uses Zustand's `persist` middleware to automatically save state to localStorage under the key `auth-storage`. This ensures user data persists across page refreshes and browser sessions.

### Best Practices

1. Use the store in components that need auth state
2. Call actions using `useAuthStore.getState()` outside of React components or in event handlers
3. Use the selector pattern to avoid unnecessary re-renders:
   ```typescript
   const user = useAuthStore((state) => state.user);
   const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
   ```
4. The token can be used for API requests by accessing it from the store
