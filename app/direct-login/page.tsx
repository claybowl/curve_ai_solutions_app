"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DirectLoginForm } from "@/components/auth/direct-login-form"

export default function DirectLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Use this special login page to bypass routing issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DirectLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}