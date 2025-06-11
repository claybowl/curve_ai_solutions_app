"use client"

import React, { useState } from 'react'
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function PasswordTest() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSignIn = async () => {
    if (!email || !password) {
      setStatus('error')
      setMessage('Please enter email and password')
      return
    }

    setStatus('loading')
    setMessage('Signing in...')

    try {
      const { data, error } = await signInWithEmail(email, password)
      
      if (error) {
        setStatus('error')
        setMessage(`Sign in failed: ${error.message}`)
        console.error('Sign in error:', error)
      } else {
        setStatus('success')
        setMessage('Sign in successful! Redirecting...')
        console.log('Sign in successful:', data)
        
        // Redirect after a moment
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1500)
      }
    } catch (err) {
      setStatus('error')
      setMessage(`Unexpected error: ${err}`)
      console.error('Unexpected error:', err)
    }
  }

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      setStatus('error')
      setMessage('Please fill in all required fields')
      return
    }

    setStatus('loading')
    setMessage('Creating account...')

    try {
      const { data, error } = await signUpWithEmail(email, password, {
        firstName,
        lastName,
        companyName,
        role: 'client'
      })
      
      if (error) {
        setStatus('error')
        setMessage(`Sign up failed: ${error.message}`)
        console.error('Sign up error:', error)
      } else {
        setStatus('success')
        setMessage('Account created successfully! Check your email for verification.')
        console.log('Sign up successful:', data)
      }
    } catch (err) {
      setStatus('error')
      setMessage(`Unexpected error: ${err}`)
      console.error('Unexpected error:', err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Password Authentication Test</CardTitle>
        <CardDescription>
          Test both sign in and sign up with password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                onClick={handleSignIn}
                disabled={status === 'loading'}
                className="w-full"
              >
                {status === 'loading' ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Company Name (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <Button 
                onClick={handleSignUp}
                disabled={status === 'loading'}
                className="w-full"
              >
                {status === 'loading' ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {message && (
          <Alert variant={status === 'error' ? 'destructive' : 'default'} className="mt-4">
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}