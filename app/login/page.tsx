"use client"

import React, { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SupabaseAuthUI } from "@/components/auth/supabase-auth-ui"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrlFromParams = searchParams?.get("callbackUrl")
  const errorMessage = searchParams?.get("error")
  const [isLoading, setIsLoading] = useState(true)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [error, setError] = useState<string | null>(errorMessage)

  // Check if already logged in
  useEffect(() => {
    let mounted = true;
    let loadingTimeout: NodeJS.Timeout;
    
    async function checkSession() {
      try {
        console.log("Checking session...")
        setDebugInfo("Checking session...")
        
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error("Session error:", sessionError.message)
          setError(sessionError.message)
          setDebugInfo(prev => prev + "\nSession error: " + sessionError.message)
          setIsLoading(false)
          return
        }
        
        if (data?.session) {
          // Check user role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', data.session.user.id)
            .single()
          
          const isAdmin = profile?.role === 'admin';
          const finalRedirectUrl = isAdmin ? '/admin' : (callbackUrlFromParams || "/dashboard");
          const userInfo = `User ID: ${data.session.user.id}, Email: ${data.session.user.email}, Role: ${profile?.role || 'none'}, IsAdmin: ${isAdmin}`
          console.log("User already authenticated", userInfo)
          setDebugInfo(prev => prev + "\nUser authenticated: " + userInfo)
          console.log("Redirecting to:", finalRedirectUrl)
          
          try {
            // Force a refresh to ensure we have the latest session data
            await supabase.auth.refreshSession()
            setDebugInfo(prev => prev + "\nSession refreshed, redirecting to: " + finalRedirectUrl)
            
            // Redirect with short delay to ensure cookies are set
            setTimeout(() => {
              if (mounted) {
                router.push(finalRedirectUrl)
                router.refresh()
              }
            }, 300)
          } catch (refreshError) {
            console.error("Failed to refresh session:", refreshError)
            setDebugInfo(prev => prev + "\nRefresh error: " + JSON.stringify(refreshError))
            setError("Failed to refresh session")
            setIsLoading(false)
          }
        } else {
          console.log("No active session found")
          setDebugInfo(prev => prev + "\nNo active session found")
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setDebugInfo(prev => prev + "\nError checking session: " + JSON.stringify(error))
        if (mounted) {
          setError("Error checking authentication status")
          setIsLoading(false)
        }
      }
    }
    
    // Set a timeout to prevent endless loading state
    loadingTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.log("Loading timeout triggered")
        setDebugInfo(prev => prev + "\nLoading timeout triggered")
        setError("Login process timed out. Please try again.")
        setIsLoading(false)
      }
    }, 5000);
    
    checkSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event)
      setDebugInfo(prev => prev + "\nAuth event: " + event)
      
      if (event === 'SIGNED_IN' && session) {
        // Check user role from profiles table
        supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            const isAdmin = profile?.role === 'admin';
            const finalRedirectUrl = isAdmin ? '/admin' : (callbackUrlFromParams || "/dashboard");
            console.log(`Signed in, admin: ${isAdmin}, redirecting to ${finalRedirectUrl}`)
            setDebugInfo(prev => prev + `\nSigned in, admin: ${isAdmin}, redirecting to: ${finalRedirectUrl}`)
            
            router.push(finalRedirectUrl)
            router.refresh()
          })
      }
    })
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    }
  }, [router, callbackUrlFromParams, isLoading])

  // Function to reset the login process
  const resetLogin = () => {
    setIsLoading(false)
    setError(null)
    setDebugInfo("Login cancelled by user. Ready to try again.")
  }

  // If checking auth state or already logged in, show loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="flex flex-col items-center max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Loader2 className="h-8 w-8 animate-spin text-[#0076FF] mb-4" />
          <p className="text-center mb-2">Authenticating, please wait...</p>
          <button 
            onClick={resetLogin}
            className="text-blue-500 text-sm hover:underline mt-4"
          >
            Cancel and return to login
          </button>
          
          {debugInfo && (
            <div className="mt-6 w-full">
              <p className="text-xs text-gray-500 mb-1">Debug Information:</p>
              <pre className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-40 w-full">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password or use a social provider to sign in.
          </CardDescription>
          {error && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <SupabaseAuthUI />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            <p>Admin users will be redirected to the admin dashboard.</p>
            <p>Regular users will access client features.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}