import { auth } from '@/lib/auth.config';
import { SessionUser } from '@/types';

// Get current session (server-side)
export async function getSession() {
  return await auth();
}

// Get current user (server-side)
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();
  return session?.user || null;
}

// Check if user has specific permission
export function hasPermission(user: SessionUser | null, permission: string): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

// Check if user has any of the permissions
export function hasAnyPermission(user: SessionUser | null, permissions: string[]): boolean {
  if (!user) return false;
  return permissions.some(permission => user.permissions.includes(permission));
}

// Check if user has all permissions
export function hasAllPermissions(user: SessionUser | null, permissions: string[]): boolean {
  if (!user) return false;
  return permissions.every(permission => user.permissions.includes(permission));
}

// Check if user has specific role
export function hasRole(user: SessionUser | null, role: string): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

// Check if user has any of the roles
export function hasAnyRole(user: SessionUser | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.some(role => user.roles.includes(role));
}

// Format permission string to readable text
export function formatPermission(permission: string): string {
  const [resource, action] = permission.split(':');
  return `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`;
}

// Get user initials for avatar
export function getUserInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'U';
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

// Get user full name
export function getUserFullName(firstName?: string, lastName?: string): string {
  return `${firstName || ''} ${lastName || ''}`.trim() || 'Unknown User';
}