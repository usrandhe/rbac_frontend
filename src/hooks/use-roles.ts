'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/lib/api/roles.api';
import { CreateRoleInput, UpdateRoleInput, PaginationParams, AssignPermissionsInput } from '@/types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

// Get all roles query
export function useRoles(params?: PaginationParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: async () => {
      const response = await rolesApi.getRoles(params);
      return response;
    },
  });
}

// Get single role query
export function useRole(id: string) {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: async () => {
      const response = await rolesApi.getRole(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create role mutation
export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRoleInput) => {
      const response = await rolesApi.createRole(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role created successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Update role mutation
export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoleInput }) => {
      const response = await rolesApi.updateRole(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      toast.success('Role updated successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Delete role mutation
export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await rolesApi.deleteRole(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Assign permissions to role mutation
export function useAssignPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AssignPermissionsInput }) => {
      const response = await rolesApi.assignPermissions(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      toast.success('Permissions assigned successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Add single permission to role mutation
export function useAddPermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: string; permissionId: string }) => {
      const response = await rolesApi.addPermission(roleId, permissionId);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.roleId] });
      toast.success('Permission added successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Remove permission from role mutation
export function useRemovePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, permissionId }: { roleId: string; permissionId: string }) => {
      const response = await rolesApi.removePermission(roleId, permissionId);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.roleId] });
      toast.success('Permission removed successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}