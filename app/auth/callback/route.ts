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
      // Debug: Log user structure to understand what we're working with
      console.log('Stack Auth user object:', JSON.stringify(user, null, 2))

      // Check if user is admin
      let isAdmin = false
      const email = (user as any).primaryEmail || (user as any).email || (user as any).user?.email

      // Stack Auth stores extra data in the metadata field
      const metadata = (user as any).metadata || (user as any).userMetadata || {}

      // Method 1: Check if role is set to admin in metadata
      if (metadata.role === 'admin') {
        isAdmin = true
      }

      // Method 2: Check for specific admin emails (for initial setup)
      if (!isAdmin && (email === 'admin@curveai.com' || email === 'clayton@donjon.ai' || email === 'austin@curveai.com')) {
        isAdmin = true
        // Optionally update metadata for future checks
        try {
          await stackServerApp.updateUser((user as any).id || (user as any).user?.id, {
            metadata: {
              ...metadata,
              role: 'admin',
              autoDetected: true
            }
          })
        } catch (e) {
          console.error('Failed to update user metadata:', e)
        }
      }

      console.log('User email:', (user as any).primaryEmail || (user as any).email)
      console.log('Is admin?', isAdmin)

      // Successful authentication - redirect to appropriate URL
      const redirectUrl = isAdmin ? '/admin' : callbackUrl
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  } catch (error) {
    console.error('Error in auth callback:', error)
    console.error('Full error details:', JSON.stringify(error, null, 2))
  }

  // Default redirect to login if callback handling fails
  return NextResponse.redirect(new URL('/login', request.url))
}

