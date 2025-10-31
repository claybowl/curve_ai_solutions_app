/**
 * Setup Admin User Page
 *
 * Use this page to grant admin privileges to users after they've logged in.
 * This should only be accessible to existing admins.
 */

'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Shield } from 'lucide-react'

export default function SetupAdminPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const makeAdmin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setMessageType('success')
        setEmail('')
      } else {
        setMessage(data.error || 'Failed to make user admin')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Network error. Please try again.')
      setMessageType('error')
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Grant Admin Access</CardTitle>
            <CardDescription>
              Enter the email address of the user you want to make an admin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && makeAdmin()}
                disabled={loading}
              />
            </div>
            <Button
              onClick={makeAdmin}
              disabled={loading || !email}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Make Admin'
              )}
            </Button>

            {message && (
              <div
                className={`p-3 rounded-md text-sm ${
                  messageType === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <div className="text-xs text-gray-500 text-center">
              Note: The user must already have an account to be made an admin.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}