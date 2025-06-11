"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase-client'
import { Loader2 } from 'lucide-react'

// Debug function to log information
function logDebug(message: string, data?: any) {
  const timestamp = new Date().toISOString().substring(11, 23)
  console.log(`[${timestamp}] Auth UI: ${message}`, data || '')
}

export function SupabaseAuthUI() {
  const router = useRouter()
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null)
  const [finalRedirectToProp, setFinalRedirectToProp] = useState<string>('')

  useEffect(() => {
    // Get the callbackUrl from the URL if it exists
    const params = new URLSearchParams(window.location.search)
    const callbackUrlFromParams = params.get('callbackUrl')
    // Default to /dashboard if no callbackUrlFromParams
    const baseRedirectPath = callbackUrlFromParams || '/dashboard' 
    setRedirectUrl(baseRedirectPath) // Used for logging and potential non-admin redirect path

    logDebug('Initializing with base callback URL (from params or /dashboard)', baseRedirectPath)

    // Check for existing session on mount to determine initial redirectTo for the Auth component
    async function configureRedirectToProp() {
      let determinedRedirectTo = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(baseRedirectPath)}`;
      try {
        logDebug('Checking session to configure redirectTo prop for Auth UI');
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          logDebug('Session check error for redirectTo prop config', sessionError.message);
        } else if (data?.session) {
          const isAdmin = data.session.user.user_metadata?.role === 'admin';
          const adminAwareRedirect = isAdmin ? '/admin' : baseRedirectPath;
          determinedRedirectTo = `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(adminAwareRedirect)}`;
          logDebug('Existing session found for redirectTo prop config', {
            userId: data.session.user.id,
            isAdmin,
            finalRedirectPathForProp: adminAwareRedirect,
          });
        } else {
          logDebug('No existing session for redirectTo prop config, using base path.');
        }
      } catch (error) {
        logDebug('Error checking session for redirectTo prop config', error);
      }
      setFinalRedirectToProp(determinedRedirectTo);
    }

    configureRedirectToProp();

    async function checkSession() {
      try {
        logDebug('Checking for existing session (for immediate redirect if already logged in)')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          logDebug('Session check error (immediate redirect)', error.message)
          return
        }
        
        if (data?.session) {
          const isAdmin = data.session.user.user_metadata?.role === 'admin';
          const finalRedirectPath = isAdmin ? '/admin' : (redirectUrl || '/dashboard'); // Use state redirectUrl here

          logDebug('Existing session found (immediate redirect)', {
            userId: data.session.user.id,
            email: data.session.user.email,
            isAdmin,
            finalRedirectPath
          })
          
          // Force fresh state
          await supabase.auth.refreshSession()
          
          // Redirect to callback URL
          logDebug('Redirecting (immediate) to', finalRedirectPath)
          router.push(finalRedirectPath)
          router.refresh()
        } else {
          logDebug('No existing session found (immediate redirect)')
        }
      } catch (error) {
        logDebug('Error checking session (immediate redirect)', error)
      }
    }
    
    // Only run checkSession if finalRedirectToProp is set, meaning initial config is done.
    if (finalRedirectToProp) {
      checkSession()
    }

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logDebug('Auth state change event', { event, sessionExists: !!session })
        
        if (event === 'SIGNED_IN' && session) {
          const isAdmin = session.user.user_metadata?.role === 'admin';
          // Use redirectUrl state which holds callbackUrlFromParams or /dashboard
          const finalRedirectOnChange = isAdmin ? '/admin' : (redirectUrl || '/dashboard'); 
          logDebug('User signed in (onAuthStateChange)', {
            userId: session.user.id,
            email: session.user.email,
            isAdmin,
            finalRedirectPath: finalRedirectOnChange
          })
          
          // Wait a moment to ensure cookies are set
          setTimeout(() => {
            // Redirect on successful sign in
            logDebug('Redirecting after sign-in (onAuthStateChange) to', finalRedirectOnChange)
            router.push(finalRedirectOnChange)
            router.refresh()
          }, 300) // Reduced delay slightly
        }
      }
    )

    return () => {
      logDebug('Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [router, redirectUrl, finalRedirectToProp]) // Added finalRedirectToProp

  if (!finalRedirectToProp) {
    // Show a loader or minimal UI while determining the redirectTo prop
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
        <span className="ml-2">Initializing login...</span>
      </div>
    );
  }

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
        redirectTo={finalRedirectToProp}
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