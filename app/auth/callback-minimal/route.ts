import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Minimal callback started:', { code: !!code, url: request.url })

  if (!code) {
    console.log('No code found, redirecting to login')
    return NextResponse.redirect(new URL('/login-minimal?error=No+code', requestUrl.origin))
  }

  try {
    const supabase = await createServerSupabaseClient()
    
    // Exchange code for session
    console.log('Exchanging code for session...')
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Code exchange failed:', exchangeError)
      return NextResponse.redirect(new URL(`/login-minimal?error=${encodeURIComponent(exchangeError.message)}`, requestUrl.origin))
    }

    // Get the session
    console.log('Getting session...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      console.error('Session retrieval failed:', sessionError)
      return NextResponse.redirect(new URL('/login-minimal?error=Session+failed', requestUrl.origin))
    }

    console.log('Session established for user:', session.user.email)

    // Check user role
    console.log('Checking user role...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (profileError) {
      console.error('Profile lookup failed:', profileError)
      // Continue anyway, default to user dashboard
    }

    const isAdmin = profile?.role === 'admin'
    const redirectTo = isAdmin ? '/admin' : '/dashboard'
    
    console.log('Redirecting to:', redirectTo, 'isAdmin:', isAdmin)
    
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
    
  } catch (error) {
    console.error('Callback error:', error)
    return NextResponse.redirect(new URL('/login-minimal?error=Server+error', requestUrl.origin))
  }
}