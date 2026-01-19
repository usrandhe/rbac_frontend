import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  User,
  CreateUserInput,
  UpdateUserInput,
  PaginationParams,
} from '@/types';

export const usersApi = {
  // Get all users with pagination
  getUsers: async (params?: PaginationParams): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (data: CreateUserInput): Promise<ApiResponse<User>> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  // Update user
  updateUser: async (id: string, data: UpdateUserInput): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  // Assign roles to user
  assignRoles: async (id: string, roleIds: string[]): Promise<ApiResponse<User>> => {
    const response = await apiClient.post(`/users/${id}/roles`, { roleIds });
    return response.data;
  },

  // Remove role from user
  removeRole: async (id: string, roleId: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.delete(`/users/${id}/roles/${roleId}`);
    return response.data;
  },

  // Get user permissions
  getUserPermissions: async (id: string): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get(`/users/${id}/permissions`);
    return response.data;
  },
};