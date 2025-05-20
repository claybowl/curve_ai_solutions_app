import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Create a response to modify
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Add a unique request ID for debugging
  const requestId = Math.random().toString(36).substring(2, 10)
  console.log(`[${requestId}] Middleware processing path: ${path}`)
  
  // Handle redirects for deprecated auth routes
  if (path.startsWith("/auth/signin") || path === "/auth/login") {
    console.log("Middleware: Redirecting deprecated auth route:", path)
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl")
    const url = new URL("/login", request.url)
    if (callbackUrl) {
      url.searchParams.set("callbackUrl", callbackUrl)
    }
    return NextResponse.redirect(url)
  }
  
  // Skip middleware if path starts with /api/auth
  if (path.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // Refresh session if available
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error(`[${requestId}] Session error in middleware:`, sessionError.message)
      // Continue with no session
    }
    
    // Log session status
    if (session) {
      console.log(`[${requestId}] Authenticated user:`, session.user.id)
    } else {
      console.log(`[${requestId}] No active session found`)
    }
  } catch (error) {
    console.error(`[${requestId}] Error retrieving session:`, error)
    // Continue with no session
  }

  // Handle admin routes
  if (path.startsWith("/admin")) {
    try {
      console.log(`[${requestId}] Checking admin access for`, path)
      
      // Get session with a fresh request to ensure we have the latest data
      const { data: { session } } = await supabase.auth.getSession()
      
      // Check if user is authenticated and is an admin
      if (!session) {
        console.log(`[${requestId}] Redirecting to login from admin route - Not authenticated`)
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        return NextResponse.redirect(url)
      }
      
      if (session.user.user_metadata?.role !== "admin") {
        console.log(`[${requestId}] User authenticated but not admin:`, session.user.email)
        console.log(`[${requestId}] User metadata:`, JSON.stringify(session.user.user_metadata))
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        url.searchParams.set("error", "You do not have admin access")
        return NextResponse.redirect(url)
      }
      
      console.log(`[${requestId}] Admin access granted for:`, session.user.email)
    } catch (error) {
      console.error(`[${requestId}] Error in middleware (admin route):`, error)
      // If there's an error, redirect to login as a fallback
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  // Handle dashboard routes
  if (path === "/dashboard") {
    try {
      console.log(`[${requestId}] Checking auth for dashboard`)
      
      // Get session with a fresh request to ensure we have the latest data
      const { data: { session } } = await supabase.auth.getSession()
      
      console.log(`[${requestId}] Session exists:`, !!session)
      if (session) {
        console.log(`[${requestId}] User ID:`, session.user.id)
        console.log(`[${requestId}] User email:`, session.user.email)
        console.log(`[${requestId}] User role:`, session.user.user_metadata?.role || 'none')
      }
      
      // Check if user is authenticated
      if (!session) {
        console.log(`[${requestId}] Redirecting to login from dashboard - Not authenticated`)
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        console.log(`[${requestId}] Redirect URL:`, url.toString())
        return NextResponse.redirect(url)
      }
      
      console.log(`[${requestId}] Dashboard access granted for:`, session.user.email)
    } catch (error) {
      console.error(`[${requestId}] Error in middleware (dashboard):`, error)
      // If there's an error, redirect to login as a fallback
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  return res
}

// Configure the middleware matcher
export const config = {
  matcher: [
    "/admin/:path*", 
    "/dashboard", 
    "/api/:path*", 
    "/auth/signin", 
    "/auth/login",
    "/profile",
    "/auth/callback"
  ],
}