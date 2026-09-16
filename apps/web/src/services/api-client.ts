

const API_URL = import.meta.env.VITE_API_URL ?? '';



interface RequestOptions {
  headers?: HeadersInit;
  signal?: AbortSignal;
}

const request = async <T>(
  endpoint: string,
  options: RequestInit & RequestOptions = {},
): Promise<T> => {
  const {
    headers: customHeaders,
    body,
    ...rest
  } = options;

  const headers = new Headers(customHeaders);

  // Don't set Content-Type for FormData.
  // Browser will automatically set multipart/form-data
  // with the correct boundary.
  if (!(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...rest,
      body,
      headers,
    },
  );

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const error = await response.json();

      message =
        error.message ?? message;
    } catch {
      // Response was not JSON.
    }

    throw new Error(message);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export const apiClient = {
  get: <T>(
    endpoint: string,
    options?: RequestOptions,
  ) =>
    request<T>(endpoint, {
      method: 'GET',
      ...options,
    }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) =>
    request<T>(endpoint, {
      method: 'POST',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
      ...options,
    }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) =>
    request<T>(endpoint, {
      method: 'PUT',
      body:
        body instanceof FormData
          ? body
          : body !== undefined
            ? JSON.stringify(body)
            : undefined,
      ...options,
    }),

  delete: <T>(
    endpoint: string,
    options?: RequestOptions,
  ) =>
    request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    }),
};