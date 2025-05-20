"use client"

import React, { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SupabaseLoginForm } from "@/components/auth/supabase-login-form"
import { SupabaseAuthUI } from "@/components/auth/supabase-auth-ui"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"
  const errorMessage = searchParams?.get("error")
  const [useCustomUI, setUseCustomUI] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(errorMessage)

  // Check if already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        console.log("Checking session...")
        const { data, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session error:", sessionError.message)
          setError(sessionError.message)
          setIsLoading(false)
          return
        }
        
        if (data.session) {
          console.log("User already authenticated, session found:", data.session.user.id)
          console.log("Redirecting to:", callbackUrl)
          router.push(callbackUrl)
        } else {
          console.log("No active session found")
        }
      } catch (error) {
        console.error("Error checking session:", error)
        setError("Error checking authentication status")
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [router, callbackUrl, errorMessage])

  // If checking auth state or already logged in, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password to sign in to your account
          </CardDescription>
          {error && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {useCustomUI ? (
            <SupabaseLoginForm />
          ) : (
            <SupabaseAuthUI />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <button 
            onClick={() => setUseCustomUI(!useCustomUI)}
            className="w-full py-2 px-4 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {useCustomUI 
              ? "Use Social Login (Google/GitHub)" 
              : "Use Email/Password Login"}
          </button>
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