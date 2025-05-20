import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a singleton supabase client for use throughout the app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type for Supabase user metadata that includes role
export type UserMetadata = {
  role?: 'admin' | 'client'
  firstName?: string
  lastName?: string
}

// Functions for authentication and user management
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

export async function signUpWithEmail(email: string, password: string, metadata: UserMetadata) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

export async function updateUserMetadata(metadata: UserMetadata) {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata,
  })
  
  return { data, error }
}

// Function to check if user has admin role
export async function isUserAdmin() {
  const { user, error } = await getCurrentUser()
  
  if (error || !user) {
    return false
  }
  
  return user.user_metadata?.role === 'admin'
}