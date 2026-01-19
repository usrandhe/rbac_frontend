import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  Permission,
  CreatePermissionInput,
  UpdatePermissionInput,
  PaginationParams,
  GroupedPermissions,
} from '@/types';

export const permissionsApi = {
  // Get all permissions with pagination
  getPermissions: async (params?: PaginationParams): Promise<ApiResponse<Permission[]>> => {
    const response = await apiClient.get('/permissions', { params });
    return response.data;
  },

  // Get permissions grouped by resource
  getGroupedPermissions: async (): Promise<ApiResponse<GroupedPermissions>> => {
    const response = await apiClient.get('/permissions/grouped');
    return response.data;
  },

  // Get permission by ID
  getPermission: async (id: string): Promise<ApiResponse<Permission>> => {
    const response = await apiClient.get(`/permissions/${id}`);
    return response.data;
  },

  // Create permission
  createPermission: async (data: CreatePermissionInput): Promise<ApiResponse<Permission>> => {
    const response = await apiClient.post('/permissions', data);
    return response.data;
  },

  // Update permission
  updatePermission: async (id: string, data: UpdatePermissionInput): Promise<ApiResponse<Permission>> => {
    const response = await apiClient.patch(`/permissions/${id}`, data);
    return response.data;
  },

  // Delete permission
  deletePermission: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/permissions/${id}`);
    return response.data;
  },

  // Get actions for a specific resource
  getResourceActions: async (resource: string): Promise<ApiResponse<string[]>> => {
    const response = await apiClient.get(`/permissions/resources/${resource}/actions`);
    return response.data;
  },
};