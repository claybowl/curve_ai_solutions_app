import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
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

  // Handle admin routes
  if (path.startsWith("/admin")) {
    try {
      console.log("Middleware: Checking admin access for", path)
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      console.log("Middleware: Token for admin route:", token ? `Found (role: ${token.role})` : "Not found")

      // Check if user is authenticated and is an admin
      if (!token || token.role !== "admin") {
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
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      console.log("Middleware: Token for dashboard:", token ? "Found" : "Not found")

      // Check if user is authenticated
      if (!token) {
        console.log("Middleware: Redirecting to login from dashboard - Not authenticated")
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
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

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/dashboard", "/api/:path*", "/auth/signin", "/auth/login"],
}