"use server"

/**
 * Auth actions for Supabase authentication
 * This file is kept for any server-side auth helpers if needed
 * Main authentication is handled through lib/auth.ts and Supabase client
 */

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

/**
 * Server action to sign out user
 */
export async function signOutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Server action to check if user is authenticated
 */
export async function checkAuthAction() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  return {
    isAuthenticated: !!user && !error,
    user: user,
    error: error?.message
  }
}
