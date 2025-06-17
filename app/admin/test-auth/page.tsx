"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (endpoint: string, name: string) => {
    setLoading(true)
    try {
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const data = await response.json().catch(() => ({ error: 'Invalid JSON' }))
      
      setResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          data,
          headers: Object.fromEntries(response.headers.entries()),
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [name]: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>
            Test various authentication endpoints to debug admin access
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => testEndpoint('/api/auth/session', 'session')}
              disabled={loading}
            >
              Test Session
            </Button>
            <Button 
              onClick={() => testEndpoint('/api/admin/users', 'adminUsers')}
              disabled={loading}
            >
              Test Admin Users
            </Button>
          </div>
          
          {Object.entries(results).map(([key, result]: [string, any]) => (
            <Card key={key} className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">{key}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}