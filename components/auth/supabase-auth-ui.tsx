"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'

export function SupabaseAuthUI() {
  const router = useRouter()
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get the callbackUrl from the URL if it exists
    const params = new URLSearchParams(window.location.search)
    const callbackUrl = params.get('callbackUrl')
    setRedirectUrl(callbackUrl || '/dashboard')

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Redirect on successful sign in
          router.push(redirectUrl || '/dashboard')
          router.refresh()
        }
      }
    )

    return () => {
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
        magicLink={true}
        showLinks={true}
        view="sign_in"
        theme="dark"
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