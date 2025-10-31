"use server"

/**
 * Auth actions for Stack Auth authentication
 * Main authentication is handled through Stack Auth SDK
 */

import { redirect } from "next/navigation"
import { getCurrentUserServer, isAuthenticated } from "@/lib/stack-auth-server"
import { signOut as stackSignOut } from "@/lib/stack-auth-client"

/**
 * Server action to sign out user
 */
export async function signOutAction() {
  // Stack Auth handles sign out on client side via the provider
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
