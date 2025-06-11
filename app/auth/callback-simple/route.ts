import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login-simple?error=No+authorization+code', requestUrl.origin))
  }

  try {
    const supabase = await createServerSupabaseClient()
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(new URL(`/login-simple?error=${encodeURIComponent(error.message)}`, requestUrl.origin))
    }

    // Get session to determine redirect
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.redirect(new URL('/login-simple?error=Authentication+failed', requestUrl.origin))
    }

    // Check user role for redirect
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    const redirectTo = profile?.role === 'admin' ? '/admin' : '/dashboard'
    
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
    
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/login-simple?error=Server+error', requestUrl.origin))
  }
}