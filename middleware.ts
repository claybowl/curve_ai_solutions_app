import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
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
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error("Session error in middleware:", sessionError.message)
    // Continue with no session
  }

  // Handle admin routes
  if (path.startsWith("/admin")) {
    try {
      console.log("Middleware: Checking admin access for", path)
      
      // Check if user is authenticated and is an admin
      if (!session || session.user.user_metadata?.role !== "admin") {
        console.log("Middleware: Redirecting to login from admin route - Not authorized")
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        return NextResponse.redirect(url)
      }
      
      console.log("Middleware: Admin access granted for", path)
    } catch (error) {
      console.error("Error in middleware (admin route):", error)
      // If there's an error, redirect to login as a fallback
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  // Handle dashboard routes
  if (path === "/dashboard") {
    try {
      console.log("Middleware: Checking auth for dashboard")
      console.log("Session exists:", !!session)
      if (session) {
        console.log("User ID:", session.user.id)
        console.log("User email:", session.user.email)
        console.log("User role:", session.user.user_metadata?.role)
      }
      
      // Check if user is authenticated
      if (!session) {
        console.log("Middleware: Redirecting to login from dashboard - Not authenticated")
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        console.log("Redirect URL:", url.toString())
        return NextResponse.redirect(url)
      }
      
      console.log("Middleware: Dashboard access granted")
    } catch (error) {
      console.error("Error in middleware (dashboard):", error)
      // If there's an error, redirect to login as a fallback
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  return res
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/api/:path*", "/auth/signin", "/auth/login"],
}