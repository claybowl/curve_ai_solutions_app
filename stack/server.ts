/**
 * Stack Auth Server Configuration
 * 
 * This file initializes Stack Auth for server-side operations.
 * Get your API keys from https://app.stack-auth.com/
 */

import { StackServerApp } from "@stackframe/js";

// Create mock server for build-time safety
function createMockServer(): any {
  return {
    getUser: async () => null,
    verifyToken: async () => null,
    signOut: async () => {},
  }
}

// Lazy initialization - only throw errors at runtime, not build time
let stackServerAppInstance: any = null
let initializationAttempted = false

function getStackServerApp() {
  if (stackServerAppInstance) {
    return stackServerAppInstance
  }
  
  if (initializationAttempted) {
    return createMockServer()
  }
  
  initializationAttempted = true
  
  // Check if we're in a build environment
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                       process.env.NODE_ENV === 'production' && !process.env.VERCEL
  
  try {
    const projectId = process.env.NEXT_PUBLIC_STACK_PROJECT_ID
    const publishableKey = process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
    const secretKey = process.env.STACK_SECRET_SERVER_KEY
    
    // During build, return mock if credentials missing
    if (isBuildTime && (!projectId || !publishableKey || !secretKey)) {
      console.warn('[Build] Stack Auth credentials not configured - using mock')
      return createMockServer()
    }
    
    // At runtime, validate credentials are present
    if (!projectId) {
      throw new Error("Missing NEXT_PUBLIC_STACK_PROJECT_ID environment variable")
    }
    
    if (!publishableKey) {
      throw new Error("Missing NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable")
    }
    
    if (!secretKey) {
      throw new Error("Missing STACK_SECRET_SERVER_KEY environment variable")
    }
    
    stackServerAppInstance = new StackServerApp({
      projectId,
      publishableClientKey: publishableKey,
      secretServerKey: secretKey,
      tokenStore: "memory", // Can be changed to "cookie" or custom implementation
    })
    
    return stackServerAppInstance
  } catch (error) {
    console.error('Failed to initialize Stack Auth server:', error)
    return createMockServer()
  }
}

// Export as Proxy to lazy-load on access
export const stackServerApp = new Proxy({} as StackServerApp, {
  get(_target, prop) {
    const server = getStackServerApp()
    const value = (server as any)[prop]
    if (typeof value === 'function') {
      return value.bind(server)
    }
    return value
  }
});

