import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function adminAuthMiddleware(request: NextRequest) {
  // Get the user token from cookies or headers
  const token = request.cookies.get("simple-admin-auth")?.value

  if (!token) {
    // No token found, redirect to login
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }

  // Parse the token to get user role
  const [_, role] = token.split(":")

  // Check if user is an admin
  if (role !== "admin") {
    // User is not an admin, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // User is an admin, allow access
  return NextResponse.next()
}
