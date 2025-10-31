/**
 * Stack Auth Client Configuration
 * 
 * This file initializes Stack Auth for client-side operations.
 */

"use client"

import { StackClientApp } from "@stackframe/js";

// Get the base URL for redirects (needed for OAuth)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Fallback for SSR/build time
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Safely get environment variables with fallbacks for build time
const getProjectId = () => {
  const id = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
  if (!id || typeof id !== 'string' || id.length === 0) {
    if (typeof window === 'undefined') {
      // Build time - return a placeholder
      return 'build-placeholder-project-id'
    }
    throw new Error("Missing NEXT_PUBLIC_STACK_PROJECT_ID environment variable")
  }
  return id
}

const getPublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
  if (!key || typeof key !== 'string' || key.length === 0) {
    if (typeof window === 'undefined') {
      // Build time - return a placeholder
      return 'build-placeholder-publishable-key'
    }
    throw new Error("Missing NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable")
  }
  return key
}

// Initialize Stack Auth client with all required configuration
// Use lazy initialization to avoid build-time errors
let stackClientAppInstance: StackClientApp | null = null

function getStackClientApp() {
  if (!stackClientAppInstance) {
    try {
      stackClientAppInstance = new StackClientApp({
        projectId: getProjectId(),
        publishableClientKey: getPublishableKey(),
        // URL configuration for OAuth redirects
        url: getBaseUrl(),
        // Set redirect URL for OAuth callbacks
        redirectUrl: `${getBaseUrl()}/auth/callback`,
        // Additional configuration that might be needed
        ...(process.env.NEXT_PUBLIC_STACK_JWKS_URL && {
          jwksUrl: process.env.NEXT_PUBLIC_STACK_JWKS_URL,
        }),
      })
    } catch (error) {
      // During build, return a mock client
      if (typeof window === 'undefined') {
        console.warn('Stack Auth client initialization failed during build:', error)
        // Return a mock object that won't crash
        return {
          getUser: async () => null,
          signOut: async () => {},
          signInWithCredential: async () => ({ error: new Error('Stack Auth not initialized') }),
        } as any
      }
      throw error
    }
  }
  return stackClientAppInstance
}

// Export a getter that lazy-loads the client
export const stackClientApp = new Proxy({} as StackClientApp, {
  get(_target, prop) {
    const client = getStackClientApp()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

