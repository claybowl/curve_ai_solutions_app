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
    const authTargets = [
      { label: 'client', target: client },
      { label: 'auth', target: client?.auth },
      { label: 'authClient', target: client?.authClient },
      { label: 'authentication', target: client?.authentication },
    ].filter(({ target }) => !!target)
    
    // Check available methods for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Available Stack Auth methods:', Object.getOwnPropertyNames(client).filter(name => typeof client[name] === 'function'))
      for (const { label, target } of authTargets) {
        if (target && typeof target === 'object') {
          console.log(`Available Stack Auth methods on ${label}:`, Object.getOwnPropertyNames(target).filter(name => typeof target[name] === 'function'))
        }
      }
    }
    
    const isErrorStatus = (result: any) => {
      return result && typeof result === 'object' && 'status' in result && result.status === 'error'
    }

    const hasSuccessShape = (result: any) => {
      return result && typeof result === 'object' && ('user' in result || 'accessToken' in result || 'data' in result)
    }

    const validateResult = (result: any, methodName: string) => {
      if (result === null || result === undefined) {
        throw new Error(`${methodName} returned an empty result`)
      }
      if (isErrorStatus(result)) {
        throw new Error((result as any).error?.message || 'Sign in failed')
      }
      return result
    }

    const tryMethod = async (target: any, methodName: string, args: Record<string, any>, fallbackArgs?: Record<string, any>) => {
      if (!target || typeof target[methodName] !== 'function') return null
      const method = target[methodName]
      try {
        const result = method.length >= 2 ? await method(email, password) : await method(args)
        return validateResult(result, methodName)
      } catch (methodError: any) {
        if (fallbackArgs && (methodError.message?.includes('noRedirect') || methodError.message?.includes('redirect'))) {
          const fallbackResult = method.length >= 2 ? await method(email, password) : await method(fallbackArgs)
          return validateResult(fallbackResult, methodName)
        }
        throw methodError
      }
    }

    const methodCandidates = [
      { name: 'signInWithCredential', args: { email, password, noRedirect: true }, fallbackArgs: { email, password } },
      { name: 'signInWithPassword', args: { email, password } },
      { name: 'signInWithEmailPassword', args: { email, password } },
      { name: 'signIn', args: { email, password } },
      { name: 'authenticate', args: { email, password } },
      { name: 'login', args: { email, password } },
    ]

    for (const { target } of authTargets) {
      for (const candidate of methodCandidates) {
        try {
          const result = await tryMethod(target, candidate.name, candidate.args, candidate.fallbackArgs)
          if (result !== null) {
            if (hasSuccessShape(result) || typeof result !== 'object') {
              return result
            }
            return result
          }
        } catch (methodError: any) {
          console.warn(`${candidate.name} failed:`, methodError.message)
        }
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
    const authTargets = [
      { label: 'client', target: client },
      { label: 'auth', target: client?.auth },
      { label: 'authClient', target: client?.authClient },
      { label: 'authentication', target: client?.authentication },
    ].filter(({ target }) => !!target)
    
    // Try signUp method
    const isErrorStatus = (result: any) => {
      return result && typeof result === 'object' && 'status' in result && result.status === 'error'
    }

    const tryMethod = async (target: any, methodName: string, args: Record<string, any>, fallbackArgs?: Record<string, any>) => {
      if (!target || typeof target[methodName] !== 'function') return null
      const method = target[methodName]
      try {
        const result = method.length >= 2 ? await method(email, password, displayName) : await method(args)
        if (result != null && typeof result === 'object' && !Array.isArray(result) && isErrorStatus(result)) {
          throw new Error((result as any).error?.message || 'Sign up failed')
        }
        return result
      } catch (methodError: any) {
        if (fallbackArgs && (methodError.message?.includes('noRedirect') || methodError.message?.includes('redirect'))) {
          const fallbackResult = method.length >= 2 ? await method(email, password, displayName) : await method(fallbackArgs)
          if (fallbackResult != null && typeof fallbackResult === 'object' && !Array.isArray(fallbackResult) && isErrorStatus(fallbackResult)) {
            throw new Error((fallbackResult as any).error?.message || 'Sign up failed')
          }
          return fallbackResult
        }
        throw methodError
      }
    }

    const methodCandidates = [
      { name: 'signUp', args: { email, password, displayName, noRedirect: true }, fallbackArgs: { email, password, displayName } },
      { name: 'signUpWithEmailPassword', args: { email, password, displayName } },
      { name: 'register', args: { email, password, displayName } },
    ]

    for (const { target } of authTargets) {
      for (const candidate of methodCandidates) {
        try {
          const result = await tryMethod(target, candidate.name, candidate.args, candidate.fallbackArgs)
          if (result !== null) {
            return result
          }
        } catch (methodError: any) {
          console.warn(`${candidate.name} failed:`, methodError.message)
        }
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

    // Stack Auth uses signInWithOAuthProvider for OAuth flows
    if (typeof client.signInWithOAuthProvider === 'function') {
      // Debug: Log available OAuth providers
      console.log(`Attempting OAuth sign-in with ${provider}`)
      console.log('Available methods:', Object.getOwnPropertyNames(client).filter(name => typeof client[name] === 'function'))

      // This method should trigger a redirect automatically
      // Don't await the result as it will redirect the page
      const result = client.signInWithOAuthProvider(provider)

      // Log result for debugging (might be undefined due to redirect)
      console.log('OAuth method called, result:', result)
      return
    }

    // Fallback to other possible method names
    const oauthMethod = client.signInWithOAuth || client.signInWithProvider

    if (!oauthMethod || typeof oauthMethod !== 'function') {
      throw new Error(`Stack Auth OAuth sign-in method not available for ${provider}. Please check Stack Auth SDK version.`)
    }

    // Call OAuth method - this should redirect automatically
    // Don't await as OAuth redirects typically don't return
    oauthMethod.call(client, provider)

    // Add a small delay to allow redirect to initiate
    await new Promise(resolve => setTimeout(resolve, 100))

    // If we're still here, the redirect didn't happen
    console.warn(`OAuth redirect for ${provider} may not have initiated properly`)

  } catch (error: any) {
    console.error("Error signing in with OAuth:", error)

    // Check for specific error messages
    if (error.message?.includes('not configured') || error.message?.includes('not enabled')) {
      throw new Error(`${provider} is not configured in Stack Auth. Please enable it in your Stack Auth dashboard.`)
    }

    if (error.message?.includes('redirect_uri')) {
      throw new Error(`Invalid redirect URL for ${provider}. Please check your Stack Auth OAuth configuration.`)
    }

    throw new Error(`Failed to sign in with ${provider}. Please check your Stack Auth configuration.`)
  }
}

