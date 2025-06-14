import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Skip middleware for auth callback and API routes
  if (path.startsWith("/auth/callback") || path.startsWith("/api/")) {
    return NextResponse.next()
  }

  // Create Supabase client
  let response = NextResponse.next()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables in middleware')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Only protect specific routes
  const protectedRoutes = ['/admin', '/dashboard', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  
  if (!isProtectedRoute) {
    return response
  }

  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(url)
    }

    // Admin route protection
    if (path.startsWith("/admin")) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (profile?.role !== "admin") {
        const url = new URL("/dashboard", request.url)
        return NextResponse.redirect(url)
      }
    }

  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/profile"]
}