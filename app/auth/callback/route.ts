/**
 * Supabase Auth Callback Route
 * 
 * Handles OAuth callbacks from Supabase Auth.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') || '/dashboard'

  // Handle errors
  if (error) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('error', errorDescription || error)
    return NextResponse.redirect(loginUrl)
  }

  // Exchange code for session
  if (code) {
    try {
      const supabase = await createServerSupabaseClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('error', 'Authentication failed')
        return NextResponse.redirect(loginUrl)
      }
    } catch (err) {
      console.error('Error in auth callback:', err)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'Authentication failed')
      return NextResponse.redirect(loginUrl)
    }
  }

  // Redirect to destination
  const redirectUrl = new URL(next, request.url)
  return NextResponse.redirect(redirectUrl)
}
