'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api/users.api';
import { CreateUserInput, UpdateUserInput, PaginationParams } from '@/types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

// Get all users query
export function useUsers(params?: PaginationParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const response = await usersApi.getUsers(params);
      return response;
    },
  });
}

// Get single user query
export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const response = await usersApi.getUser(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create user mutation
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const response = await usersApi.createUser(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserInput }) => {
      const response = await usersApi.updateUser(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Delete user mutation
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await usersApi.deleteUser(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Assign roles to user mutation
export function useAssignRoles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, roleIds }: { id: string; roleIds: string[] }) => {
      const response = await usersApi.assignRoles(id, roleIds);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      toast.success('Roles assigned successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Remove role from user mutation
export function useRemoveRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleId }: { userId: string; roleId: string }) => {
      const response = await usersApi.removeRole(userId, roleId);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
      toast.success('Role removed successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Get user permissions query
export function useUserPermissions(id: string) {
  return useQuery({
    queryKey: ['users', id, 'permissions'],
    queryFn: async () => {
      const response = await usersApi.getUserPermissions(id);
      return response.data;
    },
    enabled: !!id,
  });
}