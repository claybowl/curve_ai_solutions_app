import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Handle redirects for deprecated auth routes only
  if (path.startsWith("/auth/signin") || path === "/auth/login") {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl")
    const url = new URL("/login", request.url)
    if (callbackUrl) {
      url.searchParams.set("callbackUrl", callbackUrl)
    }
    return NextResponse.redirect(url)
  }
  
  // Let all other routes pass through without authentication checks
  // Authentication will be handled by individual pages
  return NextResponse.next()
}

// Configure the middleware matcher - only for auth route redirects
export const config = {
  matcher: [
    "/auth/signin", 
    "/auth/login"
  ],
}