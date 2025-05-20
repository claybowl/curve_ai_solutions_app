import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      // Exchange the code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        // Redirect to login with error
        return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
      }
      
      // Verify the session was created
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.error('No session after code exchange')
        return NextResponse.redirect(new URL('/login?error=Authentication+failed', requestUrl.origin))
      }
      
      console.log('Authentication successful, session established')
    } catch (error) {
      console.error('Exception during auth callback:', error)
      return NextResponse.redirect(new URL('/login?error=Server+error', requestUrl.origin))
    }
  }

  // URL to redirect to after sign in process completes
  const redirectTo = requestUrl.searchParams.get('redirectTo') || '/dashboard'
  console.log('Redirecting to:', redirectTo)
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}