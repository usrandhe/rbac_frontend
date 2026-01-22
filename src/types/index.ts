// USER TYPES

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  permissions: string[];
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// ROLE TYPES

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
  _count?: {
    userRoles: number;
    permissions: number;
  };
  userCount: number;
  permissionCount: number;
}

export interface RoleCount {
  userCount: number;
  permissionCount: number;
}

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

export interface AssignPermissionsInput {
  permissionIds: string[];
}

// PERMISSION TYPES

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    roles: number;
  };
}

export interface CreatePermissionInput {
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionInput {
  resource?: string;
  action?: string;
  description?: string;
}

export interface GroupedPermissions {
  [resource: string]: Permission[];
}

// AUTH TYPES

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

// API RESPONSE TYPES

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ValidationError[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// NEXTAUTH TYPES

export interface SessionUser {
  id: string;
  email: string;
  emailVerified: Date | null;
  name?: string;
  image?: string;
  firstName: string;
  lastName: string;
  roles: string[];
  permissions: string[];
  accessToken: string;
  refreshToken: string;
}

// UI STATE TYPES

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  activeUsers: number;
}

// PERMISSION CHECKING

export type ResourceType = 'users' | 'roles' | 'permissions';
export type ActionType = 'create' | 'read' | 'update' | 'delete';

export interface PermissionCheck {
  resource: ResourceType;
  action: ActionType;
}