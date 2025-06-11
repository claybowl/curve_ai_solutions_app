"use client"

import React, { Suspense, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SupabaseSignupForm } from "@/components/auth/supabase-signup-form"
import { SupabaseAuthUI } from "@/components/auth/supabase-auth-ui"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

function SignUpContent() {
  const router = useRouter()
  const [useCustomUI, setUseCustomUI] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Check if already logged in
  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getSession()
        
        if (data.session) {
          // Check user role from profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', data.session.user.id)
            .single()
          
          const isAdmin = profile?.role === 'admin'
          const redirectUrl = isAdmin ? '/admin' : '/dashboard'
          
          console.log("User already authenticated, redirecting to", redirectUrl)
          router.push(redirectUrl)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [router])

  // If checking auth state or already logged in, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          {useCustomUI ? (
            <SupabaseSignupForm />
          ) : (
            <SupabaseAuthUI />
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            <button 
              onClick={() => setUseCustomUI(!useCustomUI)}
              className="text-blue-500 hover:underline"
            >
              {useCustomUI 
                ? "Switch to Supabase Auth UI" 
                : "Switch to Custom Signup Form"}
            </button>
          </div>
          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    }>
      <SignUpContent />
    </Suspense>
  )
}