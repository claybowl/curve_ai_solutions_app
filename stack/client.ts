/**
 * Stack Auth Client Configuration
 * 
 * This file initializes Stack Auth for client-side operations.
 */

"use client"

import { StackClientApp } from "@stackframe/js";

// Mock client for build-time safety
function createMockClient() {
  return {
    getUser: async () => null,
    signOut: async () => {},
    signInWithCredential: async () => ({ error: new Error('Stack Auth not initialized') }),
  } as any
}

// Lazy initialization - deferred until runtime
let stackClientAppInstance: any = null

function getStackClientApp() {
  if (stackClientAppInstance) {
    return stackClientAppInstance
  }
  
  // Only initialize in browser environment
  if (typeof window === 'undefined') {
    return createMockClient()
  }

  try {
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
    const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
    
    if (!projectId || !publishableKey) {
      console.warn('Stack Auth credentials not configured')
      return createMockClient()
    }

    const getBaseUrl = () => {
      if (typeof window !== 'undefined') {
        return window.location.origin
      }
      return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    }

    stackClientAppInstance = new StackClientApp({
      projectId,
      publishableClientKey: publishableKey,
      url: getBaseUrl(),
      redirectUrl: `${getBaseUrl()}/auth/callback`,
      ...(process.env.NEXT_PUBLIC_STACK_JWKS_URL && {
        jwksUrl: process.env.NEXT_PUBLIC_STACK_JWKS_URL,
      }),
    })
    
    return stackClientAppInstance
  } catch (error) {
    console.warn('Failed to initialize Stack Auth client:', error)
    return createMockClient()
  }
}

// Export as Proxy to lazy-load on access
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

