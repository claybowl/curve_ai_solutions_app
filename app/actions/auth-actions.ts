"use server"

/**
 * Auth actions for Supabase authentication
 * Main authentication is handled through Supabase Auth SDK
 */

import { redirect } from "next/navigation"
import { getCurrentUserServer, isAuthenticated } from "@/lib/supabase-server"

/**
 * Server action to sign out user
 */
export async function signOutAction() {
  // Supabase handles sign out on client side via the provider
  // Server action redirects after client-side sign out
  redirect('/login')
}

/**
 * Server action to check if user is authenticated
 */
export async function checkAuthAction() {
  try {
    const isAuth = await isAuthenticated()
    const user = isAuth ? await getCurrentUserServer() : null
    
    return {
      isAuthenticated: isAuth,
      user: user,
      error: null
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      error: error instanceof Error ? error.message : 'Authentication check failed'
    }
  }
}
