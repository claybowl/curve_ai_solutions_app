/**
 * Stack Auth Client Configuration
 * 
 * This file initializes Stack Auth for client-side operations.
 */

"use client"

import { StackClientApp } from "@stackframe/js";

if (!process.env.NEXT_PUBLIC_STACK_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_STACK_PROJECT_ID environment variable")
}

if (!process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY) {
  throw new Error("Missing NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY environment variable")
}

// Get the base URL for redirects (needed for OAuth)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Fallback for SSR
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

// Initialize Stack Auth client with all required configuration
// Note: Stack Auth may require additional options depending on version
export const stackClientApp = new StackClientApp({
  projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  // URL configuration for OAuth redirects
  url: getBaseUrl(),
  // Set redirect URL for OAuth callbacks
  redirectUrl: `${getBaseUrl()}/auth/callback`,
  // Additional configuration that might be needed
  ...(process.env.NEXT_PUBLIC_STACK_JWKS_URL && {
    jwksUrl: process.env.NEXT_PUBLIC_STACK_JWKS_URL,
  }),
});

