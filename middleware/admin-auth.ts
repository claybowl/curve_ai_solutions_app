import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

/**
 * Middleware for protecting admin routes using NextAuth JWT
 * 
 * Note: This middleware is deprecated in favor of the main middleware.ts.
 * It's recommended to handle all auth checks in the main middleware.
 */
export async function adminAuthMiddleware(request: NextRequest) {
  try {
    // Get the user token from NextAuth JWT
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Check if user is authenticated
    if (!token) {
      // No token found, redirect to login
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check if user is an admin
    if (token.role !== "admin") {
      // User is not an admin, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // User is an admin, allow access
    return NextResponse.next()
  } catch (error) {
    console.error("Error in admin auth middleware:", error)
    // If there's an error, redirect to login as a fallback
    return NextResponse.redirect(new URL("/login", request.url))
  }
}