import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiErrorResponse } from '@/types/auth.types';
import { getSession, signOut } from 'next-auth/react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

/**
 * Validate that a token string looks like a genuine, unexpired JWT
 */
function isValidJwt(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  if (token === 'mock-jwt-token') return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    if (payload.exp && typeof payload.exp === 'number') {
      // Check if expired (with 10-second safety window)
      if (Date.now() >= (payload.exp - 10) * 1000) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

// Request interceptor: attach valid auth token from localStorage or NextAuth session
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      let token = localStorage.getItem('accessToken');

      // If token in localStorage is invalid or expired, check current NextAuth session
      if (!isValidJwt(token)) {
        try {
          const session = await getSession();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sessionToken = (session?.user as any)?.accessToken;
          if (isValidJwt(sessionToken)) {
            token = sessionToken;
            localStorage.setItem('accessToken', sessionToken);
          } else {
            // Remove corrupted/mock token
            localStorage.removeItem('accessToken');
            token = null;
          }
        } catch {
          // ignore session fetch errors
        }
      }

      if (token && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Allow multipart/form-data to properly calculate boundary when sending FormData
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 token refresh and standard error extraction
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 Unauthorized occurs and hasn't been retried yet
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh-token')
    ) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using refresh token stored in cookie
        const refreshResponse = await axios.post<{
          data?: { accessToken?: string };
          accessToken?: string;
        }>(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;

        if (newAccessToken && isValidJwt(newAccessToken)) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', newAccessToken);
          }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('adminPermissions');
          localStorage.removeItem('adminRole');
          // If in dashboard, sign out and redirect to login
          if (
            window.location.pathname.startsWith('/dashboard') ||
            window.location.pathname.startsWith('/settings') ||
            window.location.pathname.startsWith('/account')
          ) {
            signOut({ callbackUrl: '/login?error=SessionExpired' });
          }
        }
      } finally {
        isRefreshing = false;
      }
    }

    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.response?.data) {
      const data = error.response.data;
      if (Array.isArray(data.message)) {
        errorMessage = data.message.join(', ');
      } else if (typeof data.message === 'string') {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      }
    } else if (error.message) {
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (error.message === 'Network Error') {
        errorMessage =
          'Cannot connect to the server. Please ensure the backend is running.';
      } else {
        errorMessage = error.message;
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Something went wrong. Please try again.';
}
