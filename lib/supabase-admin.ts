import type { UserMetadata } from './supabase'
import { createClient } from '@supabase/supabase-js'

// Mock admin client for build time
function createMockAdminClient() {
  return {
    auth: {
      admin: {
        updateUserById: () => Promise.resolve({ data: { user: null }, error: null }),
        createUser: () => Promise.resolve({ data: { user: null }, error: null }),
        listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
        deleteUser: () => Promise.resolve({ data: null, error: null }),
        getUserById: () => Promise.resolve({ data: { user: null }, error: null })
      }
    }
  } as any
}

// Function to create Supabase client with admin privileges for server-side operations
function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    return createMockAdminClient()
  }

  // Create Supabase client with service role key
  try {
    return createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  } catch (error) {
    console.warn('Failed to create Supabase admin client, returning mock client:', error)
    return createMockAdminClient()
  }
}

// Lazy initialization
let supabaseAdminInstance: any = null

export const supabaseAdmin = () => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createSupabaseAdmin()
  }
  return supabaseAdminInstance
}

// Functions for admin operations

/**
 * Updates a user's role to admin
 */
export async function setUserAsAdmin(userId: string) {
  const { data, error } = await supabaseAdmin().auth.admin.updateUserById(
    userId,
    { user_metadata: { role: 'admin' } }
  )
  
  return { data, error }
}

/**
 * Creates a new admin user with the provided details
 */
export async function createAdminUser({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string
  password: string
  firstName: string
  lastName: string
}) {
  // Create the user with admin role
  const { data, error } = await supabaseAdmin().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      firstName,
      lastName,
      role: 'admin',
    } as UserMetadata,
  })
  
  return { data, error }
}

/**
 * Lists all users with pagination
 */
export async function listUsers(page = 0, perPage = 100) {
  const { data, error } = await supabaseAdmin().auth.admin.listUsers({
    page,
    perPage,
  })
  
  return { data, error }
}

/**
 * Deletes a user by ID
 */
export async function deleteUser(userId: string) {
  const { data, error } = await supabaseAdmin().auth.admin.deleteUser(userId)
  return { data, error }
}

/**
 * Updates a user's metadata
 */
export async function updateUserMetadata(userId: string, metadata: UserMetadata) {
  const { data, error } = await supabaseAdmin().auth.admin.updateUserById(
    userId,
    { user_metadata: metadata }
  )
  
  return { data, error }
}