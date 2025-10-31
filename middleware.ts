/**
 * Next.js Middleware for Stack Auth
 * 
 * Handles authentication redirects using Stack Auth.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { stackServerApp } from '@/stack/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

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
    '/auth/callback/:path*',
  ],
}

