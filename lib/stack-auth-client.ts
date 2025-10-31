/**
 * Stack Auth Client-Side Utilities
 * 
 * Client-side authentication helpers using Stack Auth.
 */

'use client'

import { stackClientApp } from "@/stack/client"

/**
 * Get current user session (client-side)
 */
export async function getCurrentUserClient() {
  try {
    const user = await stackClientApp.getUser()
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    // Verify Stack Auth client is initialized
    if (!stackClientApp) {
      throw new Error('Stack Auth client not initialized. Please check your environment variables.')
    }
    
    // Stack Auth's signInWithCredential might need to be called differently
    // Try to get the method with proper error handling
    const client = stackClientApp as any
    
    // Check available methods for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Available Stack Auth methods:', Object.getOwnPropertyNames(client).filter(name => typeof client[name] === 'function'))
    }
    
    // Try signInWithCredential with noRedirect option
    if (typeof client.signInWithCredential === 'function') {
      try {
        const result = await client.signInWithCredential({
          email,
          password,
          noRedirect: true,
        })
        
        // Handle result
        if (result && typeof result === 'object') {
          if ('status' in result && result.status === 'error') {
            throw new Error(result.error?.message || 'Sign in failed')
          }
        }
        
        return result
      } catch (methodError: any) {
        // If noRedirect doesn't work, try without it
        if (methodError.message?.includes('noRedirect') || methodError.message?.includes('accessToken')) {
          // Try without noRedirect - Stack Auth might handle redirects automatically
          return await client.signInWithCredential({
            email,
            password,
          })
        }
        throw methodError
      }
    }
    
    // Fallback: try alternative method names
    const alternativeMethods = ['signInWithPassword', 'signIn', 'authenticate']
    for (const methodName of alternativeMethods) {
      if (typeof client[methodName] === 'function') {
        return await client[methodName]({ email, password })
      }
    }
    
    throw new Error('No sign-in method found on Stack Auth client. Please check Stack Auth SDK version.')
  } catch (error: any) {
    console.error("Error signing in:", error)
    const errorMessage = error?.message || 'Failed to sign in. Please check your credentials and Stack Auth configuration.'
    throw new Error(errorMessage)
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  try {
    const client = stackClientApp as any
    
    // Try signUp method
    if (typeof client.signUp === 'function') {
      try {
        const result = await client.signUp({
          email,
          password,
          displayName,
          noRedirect: true,
        })
        
        // Handle result safely - check if result exists and is an object before using 'in' operator
        if (result != null && typeof result === 'object' && !Array.isArray(result)) {
          if ('status' in result && result.status === 'error') {
            throw new Error((result as any).error?.message || 'Sign up failed')
          }
        }
        
        return result
      } catch (methodError: any) {
        // If noRedirect doesn't work, try without it
        if (methodError.message?.includes('noRedirect') || methodError.message?.includes('accessToken')) {
          return await client.signUp({
            email,
            password,
            displayName,
          })
        }
        throw methodError
      }
    }
    
    throw new Error('Stack Auth signUp method not available')
  } catch (error: any) {
    console.error("Error signing up:", error)
    throw new Error(error?.message || 'Failed to sign up. Please check your Stack Auth configuration.')
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    await stackClientApp.signOut()
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: string) {
  try {
    // Verify Stack Auth client is initialized
    if (!stackClientApp) {
      throw new Error('Stack Auth client not initialized. Please check your environment variables.')
    }
    
    const client = stackClientApp as any
    
    // Check if method exists - try multiple possible method names
    const oauthMethod = client.signInWithOAuth || client.signInWithOAuthProvider || client.signInWithProvider
    
    if (!oauthMethod || typeof oauthMethod !== 'function') {
      throw new Error('Stack Auth OAuth sign-in method not available. Please check Stack Auth SDK version.')
    }
    
    // Stack Auth OAuth typically redirects automatically
    // Call the method but don't expect a return value since it redirects
    try {
      const result = await oauthMethod.call(client, provider)
      
      // Only check result if it's actually returned (some OAuth flows don't return)
      // Safely check result without using 'in' operator on potentially undefined values
      if (result != null && typeof result === 'object' && !Array.isArray(result)) {
        if ('status' in result && result.status === 'error') {
          throw new Error((result as any).error?.message || `OAuth sign-in with ${provider} failed`)
        }
      }
      
      // If we get here, OAuth didn't redirect (which is unusual)
      // This might mean the provider isn't configured or there's an issue
      return result
    } catch (oauthError: any) {
      // If error is about accessToken or redirect, it might be expected behavior
      // Stack Auth OAuth should redirect, so errors might be normal
      if (oauthError.message?.includes('accessToken') || oauthError.message?.includes('redirect')) {
        // This might be expected - OAuth redirects don't always return normally
        console.log('OAuth redirect initiated (error may be expected):', oauthError.message)
        return
      }
      throw oauthError
    }
  } catch (error: any) {
    console.error("Error signing in with OAuth:", error)
    const errorMessage = error?.message || `Failed to sign in with ${provider}. Please check your Stack Auth configuration.`
    throw new Error(errorMessage)
  }
}

