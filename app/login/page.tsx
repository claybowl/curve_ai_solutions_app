/**
 * Login Page using Stack Auth
 * 
 * Custom login form using Stack Auth SDK.
 */

'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { signInWithEmail, signInWithOAuth } from '@/lib/stack-auth-client'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard'
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signInWithEmail(email, password)
      // Refresh page to update auth state in provider
      window.location.href = callbackUrl
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
      setLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: string, event?: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true)
    setError(null)

    try {
      // Show loading state
      const button = event?.currentTarget
      if (button) {
        button.disabled = true
        button.textContent = `Connecting to ${provider}...`
      }

      // Initiate OAuth flow
      await signInWithOAuth(provider)

      // OAuth should redirect automatically. If we reach here, something went wrong.
      console.warn(`OAuth redirect for ${provider} did not occur`)
      setError(`Failed to connect to ${provider}. Please try again.`)

      // Reset button state
      if (button) {
        button.disabled = false
        button.textContent = provider
      }
      setLoading(false)

    } catch (err: any) {
      console.error(`OAuth login error for ${provider}:`, err)
      setError(err.message || `Failed to sign in with ${provider}`)
      setLoading(false)

      // Reset button state after a delay
      setTimeout(() => {
        const buttons = document.querySelectorAll('[onclick*="handleOAuthLogin"]')
        buttons.forEach(btn => {
          const btnElement = btn as HTMLButtonElement
          if (btnElement.textContent?.includes('Connecting')) {
            btnElement.disabled = false
            const providerName = btnElement.getAttribute('onclick')?.match(/'([^']+)'/)?.[1]
            if (providerName) btnElement.textContent = providerName
          }
        })
      }, 2000)
    }
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
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleOAuthLogin('google', e)}
                disabled={loading}
              >
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleOAuthLogin('github', e)}
                disabled={loading}
              >
                GitHub
              </Button>
            </div>
          </div>

          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

