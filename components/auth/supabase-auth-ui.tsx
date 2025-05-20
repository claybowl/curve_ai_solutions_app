"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

// Debug function to log information
function logDebug(message: string, data?: any) {
  const timestamp = new Date().toISOString().substring(11, 23)
  console.log(`[${timestamp}] Auth UI: ${message}`, data || '')
}

export function SupabaseAuthUI() {
  const router = useRouter()
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get the callbackUrl from the URL if it exists
    const params = new URLSearchParams(window.location.search)
    const callbackUrl = params.get('callbackUrl')
    const redirectPath = callbackUrl || '/dashboard'
    setRedirectUrl(redirectPath)
    
    logDebug('Initializing with callback URL', redirectPath)

    // Check for existing session on mount
    async function checkSession() {
      try {
        logDebug('Checking for existing session')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          logDebug('Session check error', error.message)
          return
        }
        
        if (data?.session) {
          logDebug('Existing session found', {
            userId: data.session.user.id,
            email: data.session.user.email,
            expiresAt: new Date(data.session.expires_at! * 1000).toISOString()
          })
          
          // Force fresh state
          await supabase.auth.refreshSession()
          
          // Redirect to callback URL
          logDebug('Redirecting to', redirectPath)
          router.push(redirectPath)
          router.refresh()
        } else {
          logDebug('No existing session found')
        }
      } catch (error) {
        logDebug('Error checking session', error)
      }
    }
    
    checkSession()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logDebug('Auth state change event', { event, sessionExists: !!session })
        
        if (event === 'SIGNED_IN' && session) {
          logDebug('User signed in', {
            userId: session.user.id,
            email: session.user.email
          })
          
          // Wait a moment to ensure cookies are set
          setTimeout(() => {
            // Redirect on successful sign in
            logDebug('Redirecting after sign-in to', redirectPath)
            router.push(redirectPath)
            router.refresh()
          }, 800) // Longer delay to ensure cookies are properly set
        }
      }
    )

    return () => {
      logDebug('Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [router, redirectUrl])

  return (
    <div className="max-w-md w-full mx-auto">
      <Auth
        supabaseClient={supabase}
        appearance={{ 
          theme: ThemeSupa,
          style: { 
            button: { background: '#0076FF', color: 'white' },
            anchor: { color: '#0076FF' },
            divider: { background: '#e2e8f0' },
            input: { background: '#f8fafc', borderColor: '#e2e8f0' },
          }
        }}
        providers={['google', 'github']} // Add the social providers you've configured in Supabase
        redirectTo={`${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectUrl || '/dashboard')}`}
        onlyThirdPartyProviders={false}
        magicLink={true}
        showLinks={true}
        view="sign_in"
        theme="dark"
        queryParams={{
          // Add timestamp to prevent caching issues
          timestamp: Date.now().toString()
        }}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign In',
              link_text: 'Already have an account? Sign in',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Password',
              button_label: 'Sign Up',
              link_text: 'Don\'t have an account? Sign up',
            },
          },
        }}
      />
    </div>
  )
}