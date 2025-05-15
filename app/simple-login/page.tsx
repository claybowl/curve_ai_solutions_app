"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function SimpleLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl")
  
  useEffect(() => {
    // Redirect to the new login page
    const redirectUrl = callbackUrl 
      ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/login"
    
    console.log("Redirecting from deprecated simple-login page to:", redirectUrl)
    router.replace(redirectUrl)
  }, [router, callbackUrl])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Redirecting to login page...</p>
    </div>
  )
}

export default function SimpleLoginRedirect() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>}>
      <SimpleLoginContent />
    </Suspense>
  )
}
