/**
 * Database functions for permissions and roles
 */
import { sql } from './db';
import type { 
  Permission,
  Role,
  UserRole,
  UserPermission,
  PermissionCategory,
  RoleFormData,
  UserWithRoles
} from '@/types/permissions';

/**
 * Get all permissions
 */
export async function getAllPermissions(): Promise<Permission[]> {
  try {
    const query = `
      SELECT 
        id, name, description, category,
        created_at as "createdAt", updated_at as "updatedAt"
      FROM permissions
      ORDER BY category, name
    `;
    
    return await sql.query(query);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
}

/**
 * Get permissions by category
 */
export async function getPermissionsByCategory(): Promise<PermissionCategory[]> {
  try {
    const permissions = await getAllPermissions();
    
    // Group permissions by category
    const categoryMap = new Map<string, Permission[]>();
    
    for (const permission of permissions) {
      if (!categoryMap.has(permission.category)) {
        categoryMap.set(permission.category, []);
      }
      categoryMap.get(permission.category)!.push(permission);
    }
    
    // Transform to array of categories
    const displayNames: Record<string, string> = {
      'user_management': 'User Management',
      'content': 'Content Management',
      'analytics': 'Analytics',
      'usage': 'Feature Usage',
      'assessments': 'Assessments',
      'consultations': 'Consultations',
      'tools': 'AI Tools'
    };
    
    return Array.from(categoryMap.entries()).map(([name, permissions]) => ({
      name,
      displayName: displayNames[name] || name.charAt(0).toUpperCase() + name.slice(1),
      permissions
    }));
  } catch (error) {
    console.error('Error fetching permissions by category:', error);
    throw error;
  }
}

/**
 * Get all roles with their permissions
 */
export async function getAllRoles(): Promise<Role[]> {
  try {
    // First get all roles
    const rolesQuery = `
      SELECT 
        id, name, description, is_default as "isDefault",
        is_system as "isSystem", created_at as "createdAt",
        updated_at as "updatedAt"
      FROM roles
      ORDER BY name
    `;
    
    const roles = await sql.query(rolesQuery);
    
    // Then get all permissions for each role
    for (const role of roles) {
      const permissionsQuery = `
        SELECT 
          p.id, p.name, p.description, p.category,
          p.created_at as "createdAt", p.updated_at as "updatedAt"
        FROM permissions p
        JOIN role_permissions rp ON p.id = rp.permission_id
        WHERE rp.role_id = $1
        ORDER BY p.category, p.name
      `;
      
      role.permissions = await sql.query(permissionsQuery, [role.id]);
    }
    
    return roles;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

/**
 * Get a role by ID with its permissions
 */
export async function getRoleById(id: number): Promise<Role | null> {
  try {
    const roleQuery = `
      SELECT 
        id, name, description, is_default as "isDefault",
        is_system as "isSystem", created_at as "createdAt",
        updated_at as "updatedAt"
      FROM roles
      WHERE id = $1
    `;
    
    const roles = await sql.query(roleQuery, [id]);
    
    if (roles.length === 0) {
      return null;
    }
    
    const role = roles[0];
    
    // Get permissions for this role
    const permissionsQuery = `
      SELECT 
        p.id, p.name, p.description, p.category,
        p.created_at as "createdAt", p.updated_at as "updatedAt"
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
      ORDER BY p.category, p.name
    `;
    
    role.permissions = await sql.query(permissionsQuery, [id]);
    
    return role;
  } catch (error) {
    console.error(`Error fetching role with id ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new role
 */
export async function createRole(roleData: RoleFormData): Promise<number> {
  try {
    // Start a transaction
    await sql`BEGIN`;
    
    try {
      // Insert the role
      const roleQuery = `
        INSERT INTO roles (name, description, is_default)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      
      const roleResult = await sql.query(roleQuery, [
        roleData.name,
        roleData.description,
        roleData.isDefault
      ]);
      
      const roleId = roleResult[0].id;
      
      // Add permission assignments
      if (roleData.permissionIds.length > 0) {
        const values = roleData.permissionIds
          .map((permId, index) => `($1, $${index + 2})`)
          .join(', ');
        
        const permissionQuery = `
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ${values}
        `;
        
        await sql.query(permissionQuery, [roleId, ...roleData.permissionIds]);
      }
      
      // If this is set as default, unset other defaults
      if (roleData.isDefault) {
        await sql.query(
          'UPDATE roles SET is_default = false WHERE id != $1',
          [roleId]
        );
      }
      
      await sql`COMMIT`;
      return roleId;
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
}

/**
 * Update an existing role
 */
export async function updateRole(id: number, roleData: RoleFormData): Promise<boolean> {
  try {
    // Start a transaction
    await sql`BEGIN`;
    
    try {
      // First check if this is a system role
      const roleCheck = await sql.query(
        'SELECT is_system FROM roles WHERE id = $1',
        [id]
      );
      
      if (roleCheck.length === 0) {
        await sql`ROLLBACK`;
        return false;
      }
      
      const isSystem = roleCheck[0].is_system;
      
      // Update the role
      const roleQuery = `
        UPDATE roles
        SET 
          name = $1,
          description = $2,
          is_default = $3,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id
      `;
      
      const roleResult = await sql.query(roleQuery, [
        roleData.name,
        roleData.description,
        roleData.isDefault,
        id
      ]);
      
      if (roleResult.length === 0) {
        await sql`ROLLBACK`;
        return false;
      }
      
      // Remove existing permission assignments
      await sql.query(
        'DELETE FROM role_permissions WHERE role_id = $1',
        [id]
      );
      
      // Add new permission assignments
      if (roleData.permissionIds.length > 0) {
        const values = roleData.permissionIds
          .map((permId, index) => `($1, $${index + 2})`)
          .join(', ');
        
        const permissionQuery = `
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ${values}
        `;
        
        await sql.query(permissionQuery, [id, ...roleData.permissionIds]);
      }
      
      // If this is set as default, unset other defaults
      if (roleData.isDefault) {
        await sql.query(
          'UPDATE roles SET is_default = false WHERE id != $1',
          [id]
        );
      }
      
      await sql`COMMIT`;
      return true;
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error(`Error updating role ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a role
 */
export async function deleteRole(id: number): Promise<boolean> {
  try {
    // Start a transaction
    await sql`BEGIN`;
    
    try {
      // Check if this is a system role
      const roleCheck = await sql.query(
        'SELECT is_system FROM roles WHERE id = $1',
        [id]
      );
      
      if (roleCheck.length === 0) {
        await sql`ROLLBACK`;
        return false;
      }
      
      const isSystem = roleCheck[0].is_system;
      
      if (isSystem) {
        // Cannot delete system roles
        await sql`ROLLBACK`;
        return false;
      }
      
      // Get default role ID
      const defaultRoleQuery = await sql.query(
        'SELECT id FROM roles WHERE is_default = true'
      );
      
      let defaultRoleId = null;
      if (defaultRoleQuery.length > 0) {
        defaultRoleId = defaultRoleQuery[0].id;
      }
      
      // Update users with this role to use default role instead
      if (defaultRoleId) {
        await sql.query(
          'UPDATE user_roles SET role_id = $1 WHERE role_id = $2',
          [defaultRoleId, id]
        );
      } else {
        // If no default role, just delete the user_roles entries
        await sql.query(
          'DELETE FROM user_roles WHERE role_id = $1',
          [id]
        );
      }
      
      // Delete role_permissions entries
      await sql.query(
        'DELETE FROM role_permissions WHERE role_id = $1',
        [id]
      );
      
      // Delete the role
      const result = await sql.query(
        'DELETE FROM roles WHERE id = $1 RETURNING id',
        [id]
      );
      
      await sql`COMMIT`;
      return result.length > 0;
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting role ${id}:`, error);
    throw error;
  }
}

/**
 * Get user roles and permissions
 */
export async function getUserPermissions(userId: number): Promise<{
  roles: Role[];
  permissions: Permission[];
}> {
  try {
    // Get user roles
    const rolesQuery = `
      SELECT 
        r.id, r.name, r.description, r.is_default as "isDefault",
        r.is_system as "isSystem", r.created_at as "createdAt",
        r.updated_at as "updatedAt"
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1
    `;
    
    const roles = await sql.query(rolesQuery, [userId]);
    
    // Get permissions from roles
    const rolePermissionsQuery = `
      SELECT 
        p.id, p.name, p.description, p.category,
        p.created_at as "createdAt", p.updated_at as "updatedAt"
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
    `;
    
    let permissions = await sql.query(rolePermissionsQuery, [userId]);
    
    // Get direct user permissions (overrides)
    const userPermissionsQuery = `
      SELECT 
        p.id, p.name, p.description, p.category,
        p.created_at as "createdAt", p.updated_at as "updatedAt",
        up.granted
      FROM permissions p
      JOIN user_permissions up ON p.id = up.permission_id
      WHERE up.user_id = $1
    `;
    
    const userPermissions = await sql.query(userPermissionsQuery, [userId]);
    
    // Apply overrides
    const permissionMap = new Map<number, Permission>();
    
    // First add all role permissions
    for (const perm of permissions) {
      permissionMap.set(perm.id, perm);
    }
    
    // Then apply overrides
    for (const perm of userPermissions) {
      if (perm.granted) {
        permissionMap.set(perm.id, perm);
      } else {
        permissionMap.delete(perm.id);
      }
    }
    
    return {
      roles,
      permissions: Array.from(permissionMap.values())
    };
  } catch (error) {
    console.error(`Error getting permissions for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Assign roles to a user
 */
export async function assignRolesToUser(userId: number, roleIds: number[]): Promise<boolean> {
  try {
    // Start a transaction
    await sql`BEGIN`;
    
    try {
      // Delete existing role assignments
      await sql.query(
        'DELETE FROM user_roles WHERE user_id = $1',
        [userId]
      );
      
      // Add new role assignments
      if (roleIds.length > 0) {
        const values = roleIds
          .map((roleId, index) => `($1, $${index + 2})`)
          .join(', ');
        
        const roleQuery = `
          INSERT INTO user_roles (user_id, role_id)
          VALUES ${values}
        `;
        
        await sql.query(roleQuery, [userId, ...roleIds]);
      }
      
      await sql`COMMIT`;
      return true;
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
  } catch (error) {
    console.error(`Error assigning roles to user ${userId}:`, error);
    throw error;
  }
}

/**
 * Set direct user permission override
 */
export async function setUserPermission(
  userId: number,
  permissionId: number,
  granted: boolean
): Promise<boolean> {
  try {
    const query = `
      INSERT INTO user_permissions (user_id, permission_id, granted)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, permission_id)
      DO UPDATE SET granted = $3, updated_at = CURRENT_TIMESTAMP
    `;
    
    await sql.query(query, [userId, permissionId, granted]);
    return true;
  } catch (error) {
    console.error(`Error setting permission override for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Remove direct user permission override
 */
export async function removeUserPermission(
  userId: number,
  permissionId: number
): Promise<boolean> {
  try {
    const result = await sql.query(
      'DELETE FROM user_permissions WHERE user_id = $1 AND permission_id = $2 RETURNING user_id',
      [userId, permissionId]
    );
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error removing permission override for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Check if a user has a specific permission
 */
export async function checkUserPermission(
  userId: number,
  permissionName: string
): Promise<boolean> {
  try {
    // Check direct user permission overrides first
    const userPermissionQuery = `
      SELECT up.granted
      FROM user_permissions up
      JOIN permissions p ON up.permission_id = p.id
      WHERE up.user_id = $1 AND p.name = $2
    `;
    
    const userPermResult = await sql.query(userPermissionQuery, [userId, permissionName]);
    
    if (userPermResult.length > 0) {
      return userPermResult[0].granted;
    }
    
    // Check role-based permissions
    const rolePermissionQuery = `
      SELECT COUNT(*) as count
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1 AND p.name = $2
    `;
    
    const rolePermResult = await sql.query(rolePermissionQuery, [userId, permissionName]);
    
    return rolePermResult[0].count > 0;
  } catch (error) {
    console.error(`Error checking permission ${permissionName} for user ${userId}:`, error);
    throw error;
  }
}