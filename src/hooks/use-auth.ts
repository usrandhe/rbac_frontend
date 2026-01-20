'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signIn, signOut } from 'next-auth/react';
import { authApi } from '@/lib/api/auth.api';
import { RegisterInput, UpdateProfileInput, ChangePasswordInput } from '@/types';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api-client';

// Login mutation
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Login successful');
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Login failed');
    },
  });
}

// Register mutation
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await authApi.register(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Registration successful! Please login.');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Logout mutation
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logout();
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Get profile query
export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await authApi.getProfile();
      return response.data;
    },
  });
}

// Update profile mutation
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      const response = await authApi.updateProfile(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}

// Change password mutation
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordInput) => {
      const response = await authApi.changePassword(data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });
}