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
    const cookieStore = await cookies()

    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
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
      }
    )
  } catch (error) {
    console.warn('Failed to create Supabase route handler client, returning mock client:', error)
    return createMockClient()
  }
}