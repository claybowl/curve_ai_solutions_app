import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Handle admin routes
  if (path.startsWith("/admin")) {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // Check if user is authenticated and is an admin
      if (!token || token.role !== "admin") {
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Error in middleware:", error)
      // If there's an error, redirect to login as a fallback
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  // Handle dashboard routes
  if (path === "/dashboard") {
    try {
      const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
      })

      // Check if user is authenticated
      if (!token) {
        const url = new URL("/login", request.url)
        url.searchParams.set("callbackUrl", encodeURI(request.url))
        return NextResponse.redirect(url)
      }
    } catch (error) {
      console.error("Error in middleware:", error)
      // If there's an error, redirect to login as a fallback
      const url = new URL("/login", request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/admin/:path*", "/dashboard"],
}
