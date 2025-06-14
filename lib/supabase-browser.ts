"use client"

import { createClient } from '@supabase/supabase-js'

// Create a browser-specific client that ensures cookies are properly set
// This is a workaround for potential SSR/client hydration issues
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  // Create the client with explicit cookie settings
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'supabase.auth.token',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce', // Use PKCE flow for added security
      cookies: {
        name: 'sb-auth',
        lifetime: 60 * 60 * 24 * 7, // 1 week
        domain: window.location.hostname,
        sameSite: 'lax',
        path: '/',
        secure: window.location.protocol === 'https:'
      }
    }
  })
}

// Browser-only Supabase client instance
let browserClient: ReturnType<typeof createBrowserClient> | null = null

// Get or create the browser client (safely)
export function getBrowserClient() {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserClient should only be called in browser context')
  }
  
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  
  return browserClient
}