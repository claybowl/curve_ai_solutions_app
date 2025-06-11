import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestId = Math.random().toString(36).substring(2, 8)
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log(`[${requestId}] Auth callback triggered with URL:`, request.url)
  console.log(`[${requestId}] Code exists:`, !!code)

  if (code) {
    // Create a Supabase client configured with the cookies
    const supabase = await createServerSupabaseClient()
    
    try {
      console.log('Auth callback: Exchanging code for session')
      
      // Exchange the code for a session
      console.log(`[${requestId}] Exchanging code for session...`)
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error(`[${requestId}] Error exchanging code for session:`, error.message)
        // Redirect to login with error
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}&from=callback`, requestUrl.origin))
      }
      
      // Verify the session was created
      console.log(`[${requestId}] Code exchanged, verifying session...`)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error(`[${requestId}] Error getting session:`, sessionError.message)
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(sessionError.message)}&from=callback_verify`, requestUrl.origin))
      }
      
      if (!session) {
        console.error(`[${requestId}] No session after code exchange`)
        return NextResponse.redirect(new URL('/login?error=Authentication+failed&from=callback_nosession', requestUrl.origin))
      }
      
      console.log(`[${requestId}] Authentication successful, session established`)
      console.log(`[${requestId}] User ID:`, session.user.id)
      console.log(`[${requestId}] User email:`, session.user.email)
      console.log(`[${requestId}] Session expires:`, new Date(session.expires_at! * 1000).toISOString())
      
      // Check user role from profiles table to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()
      
      const isAdmin = profile?.role === 'admin'
      const defaultRedirect = isAdmin ? '/admin' : '/dashboard'
      const redirectTo = requestUrl.searchParams.get('redirectTo') || defaultRedirect
      
      console.log(`[${requestId}] User role:`, profile?.role || 'none')
      console.log(`[${requestId}] Is admin:`, isAdmin)
      console.log(`[${requestId}] Redirecting to:`, redirectTo)
      
      // Create a response with the correct redirect
      const response = NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
      
      // Add debug query parameters to help track the source of redirect
      const debugUrl = new URL(redirectTo, requestUrl.origin)
      debugUrl.searchParams.set('auth_success', 'true')
      debugUrl.searchParams.set('req_id', requestId)
      
      // Return the response with the set cookies
      console.log(`[${requestId}] Auth callback complete, redirect URL:`, debugUrl.toString())
      return NextResponse.redirect(debugUrl)
      
    } catch (error) {
      console.error('Exception during auth callback:', error)
      return NextResponse.redirect(new URL('/login?error=Server+error', requestUrl.origin))
    }
  } else {
    console.error('No code found in the URL')
    return NextResponse.redirect(new URL('/login?error=No+authorization+code', requestUrl.origin))
  }
}