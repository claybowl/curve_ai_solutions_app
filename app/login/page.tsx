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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(errorMessage)

  // Check if already logged in
  useEffect(() => {
    let mounted = true;
    
    async function checkSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error("Session error:", sessionError.message)
          setError(sessionError.message)
          setIsCheckingAuth(false)
          return
        }
        
        if (data?.session) {
          // User is already logged in, check their role and redirect
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', data.session.user.id)
            .single()
          
          const isAdmin = profile?.role === 'admin';
          const finalRedirectUrl = isAdmin ? '/admin' : (callbackUrlFromParams || "/dashboard");
          
          console.log("User already authenticated, redirecting to:", finalRedirectUrl)
          router.push(finalRedirectUrl)
          return
        } else {
          // No session found, show login form
          console.log("No active session found, showing login form")
          setIsCheckingAuth(false)
        }
      } catch (error) {
        console.error("Error checking session:", error)
        if (mounted) {
          setError("Error checking authentication status")
          setIsCheckingAuth(false)
        }
      }
    }
    
    checkSession()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event)
      
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
            
            router.push(finalRedirectUrl)
            router.refresh()
          })
      }
    })
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [router, callbackUrlFromParams])

  // If checking auth state, show loading
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <div className="flex flex-col items-center max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <Loader2 className="h-8 w-8 animate-spin text-[#0076FF] mb-4" />
          <p className="text-center mb-2">Checking authentication...</p>
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