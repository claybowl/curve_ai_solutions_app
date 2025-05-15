"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function SignInRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl")
  
  useEffect(() => {
    // Redirect to the new login page
    const redirectUrl = callbackUrl 
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login"
    
    console.log("Redirecting from deprecated signin page to:", redirectUrl)
    router.replace(redirectUrl)
  }, [router, callbackUrl])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Redirecting to login page...</p>
    </div>
  )
}

export default function SignInRedirect() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>}>
      <SignInRedirectContent />
    </Suspense>
  )
} 