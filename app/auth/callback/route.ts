/**
 * Stack Auth Callback Route
 * 
 * Handles OAuth callbacks and magic link authentication from Stack Auth.
 * Stack Auth handles most of this automatically, but we can process redirects here.
 */

import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  // Handle errors
  if (error) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', error)
    return NextResponse.redirect(loginUrl)
  }

  // Stack Auth handles OAuth and magic link callbacks automatically
  // After successful authentication, check if user is authenticated
  try {
    const user = await stackServerApp.getUser()
    
    if (user) {
      // Successful authentication - redirect to callback URL or dashboard
      // Check if user is admin and redirect accordingly
      const permissions = (user as any).permissions || []
      const isAdmin = Array.isArray(permissions) && permissions.includes('admin')
      const redirectUrl = isAdmin ? '/admin' : callbackUrl
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  } catch (error) {
    console.error('Error in auth callback:', error)
  }

  // Default redirect to login if callback handling fails
  return NextResponse.redirect(new URL('/login', request.url))
}

