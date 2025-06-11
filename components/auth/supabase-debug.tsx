"use client"

import React, { useState } from 'react'
import { signInWithMagicLink } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function SupabaseDebug() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleMagicLink = async () => {
    if (!email) {
      setStatus('error')
      setMessage('Please enter an email address')
      return
    }

    setStatus('loading')
    setMessage('Sending magic link...')

    try {
      const { data, error } = await signInWithMagicLink(email)
      
      if (error) {
        setStatus('error')
        setMessage(`Error: ${error.message}`)
        console.error('Magic link error:', error)
      } else {
        setStatus('success')
        setMessage('Magic link sent! Check your email.')
        console.log('Magic link sent:', data)
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
        <CardTitle>Debug Magic Link</CardTitle>
        <CardDescription>
          Test magic link authentication directly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            onClick={handleMagicLink}
            disabled={status === 'loading'}
            className="w-full"
          >
            {status === 'loading' ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </div>
        
        {message && (
          <Alert variant={status === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}