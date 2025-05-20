import { createClient } from '@supabase/supabase-js'
import type { UserMetadata } from './supabase'

// Create a Supabase client with admin privileges for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // This is a secret admin key, only used on the server
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Functions for admin operations

/**
 * Updates a user's role to admin
 */
export async function setUserAsAdmin(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
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
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
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
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page,
    perPage,
  })
  
  return { data, error }
}

/**
 * Deletes a user by ID
 */
export async function deleteUser(userId: string) {
  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId)
  return { data, error }
}

/**
 * Updates a user's metadata
 */
export async function updateUserMetadata(userId: string, metadata: UserMetadata) {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    userId,
    { user_metadata: metadata }
  )
  
  return { data, error }
}