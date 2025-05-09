"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams?.get("registered") === "true"

  // Use demo credentials by default for easier testing
  const [email, setEmail] = useState("demo@curveai.com")
  const [password, setPassword] = useState("demo1234")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (registered) {
      setSuccessMessage("Account created successfully! Please sign in.")
    }
  }, [registered])

  // Update the handleSubmit function to store user data in sessionStorage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Use the simple-login API that works
      const res = await fetch("/api/simple-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        console.log("Login successful:", data)

        // Store token in localStorage as a backup
        if (data.token) {
          localStorage.setItem("admin-token", data.token)
        }

        // Store user data in sessionStorage
        if (data.user) {
          sessionStorage.setItem("user-data", JSON.stringify(data.user))
        }

        // Show success message briefly before redirect
        setSuccessMessage("Login successful, redirecting...")

        // Redirect based on role
        setTimeout(() => {
          if (data.user?.role === "admin") {
            router.push("/admin")
          } else {
            router.push("/dashboard")
          }
        }, 500)
      } else {
        setError(data.error || "Authentication failed")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Sign-in error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#0076FF]" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
          <div className="text-xs text-center text-gray-500">
            <p>Demo credentials:</p>
            <p>Email: demo@curveai.com</p>
            <p>Password: demo1234</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
