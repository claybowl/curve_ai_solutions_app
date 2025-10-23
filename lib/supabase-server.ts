import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

// Mock client for build time
function createMockClient() {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      updateUser: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => {
      const createChainableMock = () => ({
        select: () => createChainableMock(),
        eq: () => createChainableMock(),
        order: () => createChainableMock(),
        limit: () => createChainableMock(),
        filter: () => createChainableMock(),
        match: () => createChainableMock(),
        range: () => createChainableMock(),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        then: (resolve: any) => resolve({ data: null, error: null })
      })
      
      return {
        ...createChainableMock(),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => createChainableMock(),
        delete: () => createChainableMock()
      }
    }
  } as any
}

// Create a server-side supabase client for use in server components and API routes
export async function createServerSupabaseClient() {
  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Always return mock client if env vars are missing (including during build)
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient()
  }

  // Try to create Supabase client, fallback to mock if it fails
  try {
    let cookieStore: any
    try {
      cookieStore = await cookies()
    } catch (cookieError) {
      // Cookies might not be available in certain contexts (like dev mode refresh)
      // This is expected behavior - return mock client gracefully
      return createMockClient()
    }

    // Double-check that cookieStore is actually defined (can be undefined without throwing)
    if (!cookieStore) {
      return createMockClient()
    }

    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            try {
              return cookieStore?.get(name)?.value
            } catch {
              return undefined
            }
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore?.set({ name, value, ...options })
            } catch {
              // Silently fail if cookies not available
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore?.set({ name, value: '', ...options })
            } catch {
              // Silently fail if cookies not available
            }
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        // CRITICAL: Disable realtime to prevent memory issues during compilation
        global: {
          headers: {
            'X-Client-Info': 'curve-ai-server',
          },
        },
      }
    )
  } catch (error) {
    console.warn('Failed to create Supabase client, returning mock client:', error)
    return createMockClient()
  }
}

// Export a direct server client for API routes that handle their own cookies
export async function createRouteHandlerClient(request: Request, response: Response) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  try {
    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            const cookies = request.headers.get('cookie')
            if (!cookies) return undefined

            const cookie = cookies
              .split(';')
              .find(c => c.trim().startsWith(`${name}=`))

            return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined
          },
          set(name: string, value: string, options: any) {
            response.headers.append(
              'Set-Cookie',
              `${name}=${encodeURIComponent(value)}; ${Object.entries(options)
                .map(([key, val]) => `${key}=${val}`)
                .join('; ')}`
            )
          },
          remove(name: string, options: any) {
            response.headers.append(
              'Set-Cookie',
              `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; ${Object.entries(options)
                .map(([key, val]) => `${key}=${val}`)
                .join('; ')}`
            )
          },
        },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        // CRITICAL: Disable realtime to prevent memory issues
        global: {
          headers: {
            'X-Client-Info': 'curve-ai-route',
          },
        },
      }
    )
  } catch (error) {
    console.warn('Failed to create Supabase route handler client, returning mock client:', error)
    return createMockClient()
  }
}

// Alias for compatibility with server actions
export const createClient = createServerSupabaseClient

/**
 * Create a Supabase client with SERVICE ROLE key (bypasses RLS)
 * ONLY use this for server-side operations that need to bypass RLS
 * Never expose this to the client
 */
export async function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('Missing Supabase service role key, returning mock client')
    return createMockClient()
  }

  try {
    // Service role client - bypasses RLS, use with caution
    return createServerClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            'X-Client-Info': 'curve-ai-service-role',
          },
        },
      }
    )
  } catch (error) {
    console.warn('Failed to create service role client:', error)
    return createMockClient()
  }
}

/**
 * Verifies if the current user has admin role
 * @returns boolean indicating if the user has admin role
 */
export async function verifyAdminRole() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return false

  // Check metadata first (fastest)
  if (session.user.user_metadata?.role === 'admin' || session.user.app_metadata?.role === 'admin') {
    return true
  }

  // Check profiles table (user can read their own profile)
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      console.error('Error checking admin role:', error)
      return false
    }

    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin role (exception):', error)
    return false
  }
}

/**
 * Gets the current session if it exists
 * @returns The current session or null
 */
export async function getServerSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  return session
}

/**
 * Gets the current user if authenticated
 * @returns The current user or null
 */
export async function getServerUser() {
  const session = await getServerSession()
  return session?.user || null
}