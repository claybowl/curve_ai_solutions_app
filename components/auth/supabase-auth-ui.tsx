"use client"

import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase-client'

export function SupabaseAuthUI() {
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
        providers={[]} // Disable social providers for now
        onlyThirdPartyProviders={false}
        magicLink={false}
        showLinks={false}
        view="sign_in"
        theme="light"
        redirectTo={`${window.location.origin}/auth/callback`}
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