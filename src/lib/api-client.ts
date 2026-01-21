import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { auth } from '@/lib/auth.config';

//const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
// Use absolute URL for server-side (internal) and relative URL for client-side (proxy)
// Fallback to localhost:5000 if env vars are missing
const API_URL = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || 'http://localhost:5000/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || '/api/v1');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // For client-side requests
    if (typeof window !== 'undefined') {
      // We'll get the token from the session on client-side
      const { getSession } = await import('next-auth/react');
      const session = await getSession();

      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    } else {
      // For server-side requests
      const session = await auth();

      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - sign out
      if (typeof window !== 'undefined') {
        const { signOut } = await import('next-auth/react');
        await signOut({ redirect: false });
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (message) return message;

    if (error.response?.status === 404) return 'Resource not found';
    if (error.response?.status === 403) return 'You do not have permission to perform this action';
    if (error.response?.status === 401) return 'Please log in to continue';
    if (error.response?.status === 500) return 'Server error. Please try again later';
  }

  return 'An unexpected error occurred';
};