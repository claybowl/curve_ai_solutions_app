/**
 * Database functions for users management
 */
import { sql } from './db';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSummary {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: string;
  createdAt: Date;
}

export interface UserFormData {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: string;
}

export interface UserFilter {
  role?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Get all users with optional filtering
 */
export async function getAllUsers(filter?: UserFilter): Promise<UserSummary[]> {
  try {
    let query = `
      SELECT 
        id, email, first_name as "firstName", last_name as "lastName", 
        company_name as "companyName", role, created_at as "createdAt"
      FROM users
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    // Apply filters
    if (filter?.role) {
      query += ` AND role = $${paramCount++}`;
      params.push(filter.role);
    }
    
    if (filter?.searchTerm) {
      query += ` AND (
        email ILIKE $${paramCount} OR
        first_name ILIKE $${paramCount} OR
        last_name ILIKE $${paramCount} OR
        company_name ILIKE $${paramCount}
      )`;
      params.push(`%${filter.searchTerm}%`);
      paramCount++;
    }
    
    // Apply sorting
    if (filter?.sortBy) {
      // Map frontend field names to database column names
      const columnMap: Record<string, string> = {
        firstName: 'first_name',
        lastName: 'last_name',
        companyName: 'company_name',
        createdAt: 'created_at',
        email: 'email',
        role: 'role'
      };
      
      const columnName = columnMap[filter.sortBy] || 'created_at';
      const direction = filter.sortDirection?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      
      query += ` ORDER BY ${columnName} ${direction}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }
    
    return await sql.query(query, params);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: number): Promise<User | null> {
  try {
    const query = `
      SELECT 
        id, email, first_name as "firstName", last_name as "lastName", 
        company_name as "companyName", role, created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      WHERE id = $1
    `;
    
    const result = await sql.query(query, [id]);
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const query = `
      SELECT 
        id, email, first_name as "firstName", last_name as "lastName", 
        company_name as "companyName", role, created_at as "createdAt",
        updated_at as "updatedAt"
      FROM users
      WHERE email = $1
    `;
    
    const result = await sql.query(query, [email]);
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: UserFormData): Promise<number> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error(`User with email ${userData.email} already exists`);
    }
    
    // Hash password if provided
    let hashedPassword = null;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }
    
    const query = `
      INSERT INTO users (
        email, password_hash, first_name, last_name, 
        company_name, role
      ) VALUES (
        $1, $2, $3, $4, $5, $6
      ) RETURNING id
    `;
    
    const result = await sql.query(query, [
      userData.email,
      hashedPassword,
      userData.firstName,
      userData.lastName,
      userData.companyName || null,
      userData.role
    ]);
    
    return result[0].id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update an existing user
 */
export async function updateUser(id: number, userData: UserFormData): Promise<boolean> {
  try {
    // Check if email is taken by another user
    if (userData.email) {
      const existingUser = await getUserByEmail(userData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error(`Email ${userData.email} is already taken by another user`);
      }
    }
    
    let setClause = `
      email = $1,
      first_name = $2,
      last_name = $3,
      company_name = $4,
      role = $5,
      updated_at = CURRENT_TIMESTAMP
    `;
    
    const params = [
      userData.email,
      userData.firstName,
      userData.lastName,
      userData.companyName || null,
      userData.role,
      id
    ];
    
    // Add password update if provided
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      setClause += `, password_hash = $${params.length + 1}`;
      params.push(hashedPassword);
    }
    
    const query = `
      UPDATE users
      SET ${setClause}
      WHERE id = $6
      RETURNING id
    `;
    
    const result = await sql.query(query, params);
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: number): Promise<boolean> {
  try {
    // First check if user exists
    const user = await getUserById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    // Delete the user
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await sql.query(query, [id]);
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
}

/**
 * Get user roles for dropdown
 */
export async function getUserRoles(): Promise<string[]> {
  try {
    const query = 'SELECT DISTINCT role FROM users ORDER BY role';
    const result = await sql.query(query);
    
    return result.map(row => row.role);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return ['admin', 'client']; // Default roles
  }
}

/**
 * Check if email exists (for registration)
 */
export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await sql.query(query, [email]);
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error checking if email ${email} exists:`, error);
    throw error;
  }
}

/**
 * Reset user password
 */
export async function resetUserPassword(id: number, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const query = `
      UPDATE users
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id
    `;
    
    const result = await sql.query(query, [hashedPassword, id]);
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error resetting password for user ${id}:`, error);
    throw error;
  }
}