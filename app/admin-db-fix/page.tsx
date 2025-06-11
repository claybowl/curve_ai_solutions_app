"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

export default function AdminDbFixPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [actionResult, setActionResult] = useState<string>('')

  const runDiagnostics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/diagnose-db')
      const data = await response.json()
      setDiagnostics(data)
    } catch (error) {
      console.error('Error running diagnostics:', error)
      setActionResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  const runAction = async (action: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/diagnose-db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const data = await response.json()
      setActionResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error running action:', error)
      setActionResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Database Diagnostics & Fixes</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Run diagnostics or perform fixes on your Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={runDiagnostics}
                disabled={loading}
              >
                {loading ? 'Running...' : 'Run Diagnostics'}
              </Button>
              
              <Button 
                onClick={() => runAction('test_user_creation')}
                disabled={loading}
                variant="outline"
              >
                Test User Creation
              </Button>
            </div>
          </CardContent>
        </Card>

        {diagnostics && (
          <Card>
            <CardHeader>
              <CardTitle>Diagnostics Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={JSON.stringify(diagnostics, null, 2)}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        )}

        {actionResult && (
          <Card>
            <CardHeader>
              <CardTitle>Action Result</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-sm">{actionResult}</pre>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Manual SQL Fix</CardTitle>
            <CardDescription>
              If diagnostics show issues, run this SQL in your Supabase dashboard:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                Go to your Supabase dashboard → SQL Editor → paste the contents of `supabase-schema-fix.sql` and run it.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Issue: "Database error creating new user"</h4>
                <p className="text-sm text-gray-600">
                  Usually caused by missing profiles table, incorrect trigger function, or RLS policy issues.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Issue: "duplicate key value violates unique constraint"</h4>
                <p className="text-sm text-gray-600">
                  User with that email already exists. Check the debug users page or delete duplicates.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Solution: Fresh Start</h4>
                <p className="text-sm text-gray-600">
                  If all else fails, uncomment the DROP TABLE line in supabase-schema-fix.sql and run it to start fresh.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}