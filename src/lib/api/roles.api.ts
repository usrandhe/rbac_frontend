import apiClient from '@/lib/api-client';
import {
  ApiResponse,
  Role,
  CreateRoleInput,
  UpdateRoleInput,
  PaginationParams,
  AssignPermissionsInput,
} from '@/types';

export const rolesApi = {
  // Get all roles with pagination
  getRoles: async (params?: PaginationParams): Promise<ApiResponse<Role[]>> => {
    const response = await apiClient.get('/roles', { params });
    return response.data;
  },

  // Get role by ID
  getRole: async (id: string): Promise<ApiResponse<Role>> => {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  // Create role
  createRole: async (data: CreateRoleInput): Promise<ApiResponse<Role>> => {
    const response = await apiClient.post('/roles', data);
    return response.data;
  },

  // Update role
  updateRole: async (id: string, data: UpdateRoleInput): Promise<ApiResponse<Role>> => {
    const response = await apiClient.patch(`/roles/${id}`, data);
    return response.data;
  },

  // Delete role
  deleteRole: async (id: string): Promise<ApiResponse> => {
    const response = await apiClient.delete(`/roles/${id}`);
    return response.data;
  },

  // Assign permissions to role
  assignPermissions: async (id: string, data: AssignPermissionsInput): Promise<ApiResponse<Role>> => {
    const response = await apiClient.post(`/roles/${id}/permissions`, data);
    return response.data;
  },

  // Add single permission to role
  addPermission: async (id: string, permissionId: string): Promise<ApiResponse<Role>> => {
    const response = await apiClient.post(`/roles/${id}/permissions/add`, { permissionId });
    return response.data;
  },

  // Remove permission from role
  removePermission: async (id: string, permissionId: string): Promise<ApiResponse<Role>> => {
    const response = await apiClient.delete(`/roles/${id}/permissions/${permissionId}`);
    return response.data;
  },
};