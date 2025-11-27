import type { paths } from './generated/api';
import createFetchClient from 'openapi-fetch';
import type { ClientOptions, Middleware } from 'openapi-fetch';
import createClient from 'openapi-react-query';

export interface ApiClientConfig {
  baseUrl: string;
  getToken: () => string | undefined | null | Promise<string | undefined | null>;
  onUnauthorized?: () => void | Promise<void>; // Callback when 401 occurs
  onBeforeRequest?: (url: string) => void | Promise<void>; // Callback before each request
  onError?: (response: Response) => void | Promise<void>; // Callback when response is not ok (excluding 401 if handled by onUnauthorized)
}

// Auth endpoints that should skip the onBeforeRequest callback
// The onBeforeRequest callback is useful for non-auth endpoints to handle token refresh
// before making the actual API call, ensuring requests don't fail due to expired tokens
const AUTH_ENDPOINTS = ['/api/v1/auth/login', '/api/v1/auth/logout', '/api/v1/auth/refresh'];

export function createApiClient(config: ApiClientConfig) {
  // Create auth middleware to inject the Bearer token
  const authMiddleware: Middleware = {
    async onRequest({ request }) {
      // Check if this is an auth endpoint
      const url = new URL(request.url);
      const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => url.pathname === endpoint);

      // Call onBeforeRequest for non-auth endpoints
      if (!isAuthEndpoint && config.onBeforeRequest) {
        await config.onBeforeRequest(url.pathname);
      }

      const token = await config.getToken();

      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`);
      }

      return request;
    },
    async onResponse({ response }) {
      // Handle 401 Unauthorized errors
      if (response.status === 401 && config.onUnauthorized) {
        await config.onUnauthorized();
      } else if (!response.ok && config.onError) {
        await config.onError(response);
      }

      return response;
    },
  };

  // Configure the fetch client with base URL
  const fetchOptions: ClientOptions = {
    baseUrl: config.baseUrl,
    credentials: 'include',
  };

  // Create the type-safe fetch client using the generated OpenAPI types
  const fetchClient = createFetchClient<paths>(fetchOptions);

  // Register the auth middleware
  fetchClient.use(authMiddleware);

  // Wrap the fetch client with TanStack Query hooks for React integration
  const $api = createClient(fetchClient);

  return { $api, fetchClient };
}

export type { paths };

export const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};
