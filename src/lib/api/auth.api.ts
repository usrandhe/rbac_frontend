import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  AuthResponse,
  RegisterInput,
  User,
  UpdateProfileInput,
  ChangePasswordInput,
} from '@/types';

export const authApi = {
  // Register new user
  register: async (data: RegisterInput): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileInput): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordInput): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  // Logout
  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
};