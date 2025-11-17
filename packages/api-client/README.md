# @repo/api-client

Type-safe API client package for the RMS monorepo, built on OpenAPI specifications and TanStack Query.

## Overview

This package provides a **factory function** that creates fully type-safe API clients for consuming applications. It uses your OpenAPI 3.1 specification as the single source of truth, generating TypeScript types and providing React Query hooks.

## Features

- 🔒 **Type Safety**: Full TypeScript types generated from OpenAPI spec
- 🏭 **Factory Pattern**: Each app can inject its own runtime config (auth, base URL)
- ⚡ **TanStack Query**: React hooks for data fetching with caching and invalidation
- 🔄 **Dynamic Auth**: Runtime token injection without coupling to auth implementation
- 📦 **Shared Contract**: All apps use the same API types and client logic

## Setup

### 1. Add Your OpenAPI Specification

Replace `openapi.json` with your actual OpenAPI 3.1 specification:

```bash
# Copy your spec file
cp /path/to/your/openapi.json packages/api-client/openapi.json
```

### 2. Generate Types

Run the type generation script:

```bash
pnpm --filter @repo/api-client generate:types
```

This creates `src/generated/api.d.ts` with all your API types.

### 3. Build the Package

```bash
pnpm --filter @repo/api-client build
```

## Usage

### In an Authenticated Application

Create a client instance with auth token injection:

```typescript
// apps/admin/src/api/client.ts
import { createApiClient } from '@repo/api-client';

// Function to get the current auth token
const getAccessToken = () => {
  // Replace with your actual auth implementation
  return localStorage.getItem('auth_token');
};

// Create the authenticated client
export const { $api } = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  getToken: getAccessToken,
});
```

### In a Public Application

Create a client without authentication:

```typescript
// apps/general/src/api/client.ts
import { createApiClient } from '@repo/api-client';

// Create the public client (no auth)
export const { $api } = createApiClient({
  baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
  getToken: () => undefined, // No token needed
});
```

### In React Components

Use the TanStack Query hooks:

```typescript
import { $api } from '../api/client';

function UserProfile() {
  // Type-safe query with auto-complete
  const { data, error, isLoading } = $api.useQuery(
    'get',
    '/users/{id}',
    {
      params: {
        path: { id: '123' }
      }
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>User: {data.name}</div>;
}
```

### Using Mutations

```typescript
import { $api } from '../api/client';

function CreateUser() {
  const mutation = $api.useMutation('post', '/users');

  const handleSubmit = async (userData: any) => {
    await mutation.mutateAsync({
      body: userData
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### Direct Fetch Client (Non-React)

For non-React code or advanced use cases:

```typescript
import { createApiClient } from '@repo/api-client';

const { fetchClient } = createApiClient({
  baseUrl: 'https://api.example.com',
  getToken: () => 'your-token',
});

// Direct fetch calls
const { data, error } = await fetchClient.GET('/users/{id}', {
  params: { path: { id: '123' } },
});
```

## Scripts

- `pnpm generate:types` - Generate TypeScript types from OpenAPI spec
- `pnpm build` - Generate types and build the package
- `pnpm dev` - Watch mode for development
- `pnpm lint` - Lint the code
- `pnpm type-check` - Type check without emitting

## Architecture

```
packages/api-client/
├── openapi.json              # OpenAPI 3.1 spec (SOURCE OF TRUTH)
├── src/
│   ├── generated/
│   │   └── api.d.ts         # Auto-generated types (DO NOT EDIT)
│   ├── client.ts            # Factory function
│   └── index.ts             # Public exports
├── package.json
├── tsconfig.json
└── README.md
```

## Advanced Configuration

### Custom Request Interceptors

The factory supports custom request/response interceptors:

```typescript
// Modify src/client.ts to add custom logic
async onRequest({ request }) {
  const token = await config.getToken();
  if (token) {
    request.headers.set('Authorization', `Bearer ${token}`);
  }

  // Add custom headers
  request.headers.set('X-Client-Version', '1.0.0');

  return request;
}
```

### Error Handling

Add global error handling in the `onResponse` interceptor:

```typescript
async onResponse({ response }) {
  if (response.status === 401) {
    // Handle unauthorized (e.g., redirect to login)
  }
  return response;
}
```

## Dependencies

- `@tanstack/react-query` - React hooks for data fetching
- `openapi-fetch` - Type-safe fetch client
- `openapi-react-query` - TanStack Query integration
- `openapi-typescript` (dev) - Type generation from OpenAPI

## License

Private package for internal use.
