/**
 * Next.js Middleware for Stack Auth
 * 
 * Protects admin routes and handles authentication redirects using Stack Auth.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { stackServerApp } from '@/stack/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protect admin routes
  if (path.startsWith('/admin')) {
    try {
      // Get user from request (Stack Auth handles this via cookies/headers)
      const user = await stackServerApp.getUser()
      
      if (!user) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(loginUrl)
      }
      
      // Check admin permission
      const permissions = (user as any).permissions || []
      const isAdmin = Array.isArray(permissions) && permissions.includes('admin')
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard?message=Unauthorized', request.url))
      }
      
      return NextResponse.next()
    } catch (error) {
      // If auth check fails, redirect to login
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle auth callback routes
  if (path.startsWith('/auth/callback')) {
    // Stack Auth handles OAuth/magic link callbacks automatically
    // The callback route handler will process the token
    return NextResponse.next()
  }

  return NextResponse.next()
}

// Configure middleware matcher
export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/callback/:path*',
  ],
}

