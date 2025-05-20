"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LocalStorageLoginForm } from "@/components/auth/local-storage-login-form"

export default function LocalStorageLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in with LocalStorage</CardTitle>
          <CardDescription>
            Use this login page to bypass cookie issues by using localStorage for session persistence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LocalStorageLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}