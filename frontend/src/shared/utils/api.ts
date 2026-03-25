import { env } from '@/core/config/env';

const BASE_URL = env.NEXT_PUBLIC_API_URL;

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') return {};
  try {
    const { auth } = await import('@/core/auth/firebase');
    const user = auth.currentUser;
    if (!user) return {};
    const token = await user.getIdToken();
    return { Authorization: `Bearer ${token}` };
  } catch {
    return {};
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new APIError(response.status, error.detail ?? 'Request failed');
  }

  return response.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};