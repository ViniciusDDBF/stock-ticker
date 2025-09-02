import React from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface CrudMethods<T> {
  get: (path?: string) => Promise<T>;
  post: (data: any, path?: string) => Promise<T>;
  patch: (path: string, data: any) => Promise<T>;
  delete: (path: string) => Promise<T>;
}

type UseFetchReturn<T> = FetchState<T> & CrudMethods<T>;

function useFetch<T>(
  baseUrl: string,
  defaultOptions?: RequestInit
): UseFetchReturn<T> {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const defaultOptionsRef = React.useRef(defaultOptions);
  defaultOptionsRef.current = defaultOptions;

  const buildUrl = (path?: string): string => {
    if (!path) return baseUrl;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}/${cleanPath}`;
  };

  const makeRequest = async (
    method: string,
    path?: string,
    body?: any,
    customOptions?: RequestInit
  ): Promise<T> => {
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setError(null);

    try {
      const url = buildUrl(path);
      const options: RequestInit = {
        method,
        signal,
        ...defaultOptionsRef.current,
        ...customOptions,
      };

      // Add body for POST/PATCH requests
      if (body && (method === 'POST' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
        // Set content-type if not already provided
        if (!options.headers) {
          options.headers = {};
        }
        const headers = options.headers as Record<string, string>;
        if (!headers['Content-Type'] && !headers['content-type']) {
          headers['Content-Type'] = 'application/json';
        }
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle empty responses (common for POST/DELETE operations)
      const contentType = response.headers.get('content-type');
      let responseData: T;

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        responseData = text ? (JSON.parse(text) as T) : (null as T);
      } else {
        // For non-JSON responses or empty responses, return null
        responseData = null as T;
      }

      if (!signal.aborted) {
        setData(responseData);
      }

      return responseData;
    } catch (err) {
      if (!controller.signal.aborted) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        throw err; // Re-throw so caller can handle it
      }
      throw err;
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  };

  const get = React.useCallback(
    (path?: string): Promise<T> => makeRequest('GET', path),
    [baseUrl]
  );

  const post = React.useCallback(
    (data: any, path?: string): Promise<T> => makeRequest('POST', path, data),
    [baseUrl]
  );

  const patch = React.useCallback(
    (path: string, data: any): Promise<T> => makeRequest('PATCH', path, data),
    [baseUrl]
  );

  const del = React.useCallback(
    (path: string): Promise<T> => makeRequest('DELETE', path),
    [baseUrl]
  );

  return {
    data,
    loading,
    error,
    get,
    post,
    patch,
    delete: del,
  };
}

export default useFetch;

// // Setup (no fetch happens yet)
// const { get, post, patch, delete: del, data, loading, error } = useFetch('https://api.example.com/users', {
//   headers: { 'Authorization': 'Bearer token123' }
// });

// // Individual operations
// const handleGetUsers = async () => {
//   try {
//     const users = await get(); // GET /users
//     console.log('Got users:', users);
//   } catch (err) {
//     console.error('Failed:', err);
//   }
// };

// const handleCreateUser = async (userData) => {
//   const newUser = await post(userData); // POST /users
// };

// const handleUpdateUser = async (id, updates) => {
//   const updated = await patch(`/${id}`, updates); // PATCH /users/123
// };

// // Concurrent operations (your use case!)
// const handleBulkUpdate = async () => {
//   const results = await Promise.all(
//     users.map(user => patch(`/${user.id}`, user))
//   );
//   console.log('All updates complete:', results);
// };
