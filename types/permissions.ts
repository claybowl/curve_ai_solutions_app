/**
 * Types for permissions and roles system
 */

export interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isDefault: boolean;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
  permissions?: Permission[];
}

export interface RolePermission {
  roleId: number;
  permissionId: number;
  createdAt: Date;
}

export interface UserRole {
  userId: number;
  roleId: number;
  createdAt: Date;
  role?: Role;
}

export interface UserPermission {
  userId: number;
  permissionId: number;
  granted: boolean;
  createdAt: Date;
  updatedAt: Date;
  permission?: Permission;
}

export interface UserWithRoles {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string; // Legacy role field
  roles: Role[];
  permissions: Permission[];
}

export interface RoleFormData {
  name: string;
  description: string;
  isDefault: boolean;
  permissionIds: number[];
}

export interface PermissionCategory {
  name: string;
  displayName: string;
  permissions: Permission[];
}

// Helper function to check if a user has a specific permission
export function hasPermission(
  userPermissions: Permission[],
  permissionName: string
): boolean {
  return userPermissions.some(p => p.name === permissionName);
}