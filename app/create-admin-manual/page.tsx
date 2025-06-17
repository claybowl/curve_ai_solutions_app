"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const createAdmin = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/setup')
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'Failed to create admin')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
          <CardDescription>
            Create the first admin user for Curve AI Solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!result && !error && (
            <Button 
              onClick={createAdmin} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating Admin...' : 'Create Admin User'}
            </Button>
          )}
          
          {result && (
            <div className="space-y-2 p-4 bg-green-50 rounded">
              <h3 className="font-semibold text-green-800">Success!</h3>
              <p className="text-sm text-green-700">{result.message}</p>
              <div className="text-sm">
                <p><strong>Email:</strong> {result.email}</p>
                <p><strong>Password:</strong> {result.password}</p>
                <p><strong>User ID:</strong> {result.userId}</p>
              </div>
              <Button asChild className="w-full mt-4">
                <a href="/login">Go to Login</a>
              </Button>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 rounded">
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
              <Button 
                onClick={createAdmin} 
                variant="outline"
                className="w-full mt-4"
              >
                Try Again
              </Button>
            </div>
          )}
          
          <div className="text-sm text-gray-500 border-t pt-4">
            <p><strong>Default Admin Credentials:</strong></p>
            <p>Email: admin@curveai.com</p>
            <p>Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}