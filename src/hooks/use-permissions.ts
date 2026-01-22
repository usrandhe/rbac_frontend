'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { permissionsApi } from '@/lib/api/permissions.api';
import { CreatePermissionInput, UpdatePermissionInput, PaginationParams } from '@/types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

// Get all permissions query
export function usePermissions(params?: PaginationParams) {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: async () => {
      const response = await permissionsApi.getPermissions(params);
      return response;
    },
  });
}

// Get permissions grouped by resource
export function useGroupedPermissions() {
  return useQuery({
    queryKey: ['permissions', 'grouped'],
    queryFn: async () => {
      const response = await permissionsApi.getGroupedPermissions();
      return response.data;
    },
  });
}

// Get single permission query
export function usePermission(id: string) {
  return useQuery({
    queryKey: ['permissions', id],
    queryFn: async () => {
      const response = await permissionsApi.getPermission(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create permission mutation
export function useCreatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePermissionInput) => {
      const response = await permissionsApi.createPermission(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission created successfully', { position: "top-center" });
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Update permission mutation
export function useUpdatePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePermissionInput }) => {
      const response = await permissionsApi.updatePermission(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissions', variables.id] });
      toast.success('Permission updated successfully', { position: "top-center" });
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Delete permission mutation
export function useDeletePermission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await permissionsApi.deletePermission(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      toast.success('Permission deleted successfully', { position: "top-center" });
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Get resource actions query
export function useResourceActions(resource: string) {
  return useQuery({
    queryKey: ['permissions', 'resources', resource, 'actions'],
    queryFn: async () => {
      const response = await permissionsApi.getResourceActions(resource);
      return response.data;
    },
    enabled: !!resource,
  });
}