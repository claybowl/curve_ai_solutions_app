import { createClient } from '@supabase/supabase-js'

/**
 * Create a diagnostic Supabase client with enhanced logging
 */
export const createDiagnosticClient = () => {
  // Get Supabase URL and anon key from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  console.log('Creating diagnostic Supabase client with the following configuration:')
  console.log('URL:', supabaseUrl)
  console.log('Auth config:', {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    autoRefreshToken: true,
    detectSessionInUrl: true
  })
  
  // Create the client with verbose logging
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: 'supabase.auth.token',
      autoRefreshToken: true,
      detectSessionInUrl: true,
      debug: true, // Enable debug mode for auth
    },
    global: {
      headers: {
        'x-debug-mode': 'true',
      },
    },
  })
  
  // Wrap auth methods with logging
  const originalSignIn = client.auth.signInWithPassword
  client.auth.signInWithPassword = async (credentials) => {
    console.log('signInWithPassword called with:', { 
      email: credentials.email,
      // Don't log the actual password
      password: credentials.password ? '********' : undefined,
    })
    
    try {
      const result = await originalSignIn.call(client.auth, credentials)
      console.log('signInWithPassword result:', { 
        success: !result.error,
        error: result.error?.message,
        user: result.data.user ? {
          id: result.data.user.id,
          email: result.data.user.email,
          metadata: result.data.user.user_metadata,
        } : null,
        session: result.data.session ? {
          expires_at: result.data.session.expires_at,
        } : null,
      })
      return result
    } catch (error) {
      console.error('signInWithPassword exception:', error)
      throw error
    }
  }
  
  // Wrap getSession with logging
  const originalGetSession = client.auth.getSession
  client.auth.getSession = async () => {
    console.log('getSession called')
    
    try {
      const result = await originalGetSession.call(client.auth)
      console.log('getSession result:', {
        success: !result.error,
        error: result.error?.message,
        session: result.data.session ? {
          expires_at: result.data.session.expires_at,
          user: {
            id: result.data.session.user.id,
            email: result.data.session.user.email,
            metadata: result.data.session.user.user_metadata,
          }
        } : null,
      })
      return result
    } catch (error) {
      console.error('getSession exception:', error)
      throw error
    }
  }
  
  return client
}

/**
 * Create a diagnostic client and export it for use in debugging
 */
export const supabaseDebug = createDiagnosticClient()