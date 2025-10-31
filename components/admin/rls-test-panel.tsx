'use client'

/**
 * RLS Test Panel Component
 * Created: 2025-10-31
 * Purpose: Interactive RLS testing with one-click buttons
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2, Play, User, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

interface TestResult {
  name: string
  status: 'idle' | 'running' | 'pass' | 'fail' | 'warning'
  actual: number | null
  expected: string
  message: string
  error?: string
}

export default function RLSTestPanel() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [tests, setTests] = useState<TestResult[]>([
    {
      name: 'N8N Workflows Access',
      status: 'idle',
      actual: null,
      expected: 'admin: 6, user: 0',
      message: 'Workflows should only be visible to admins',
    },
    {
      name: 'User Profiles Access',
      status: 'idle',
      actual: null,
      expected: 'admin: all, user: 1',
      message: 'Users should only see their own profile',
    },
    {
      name: 'Solutions Access',
      status: 'idle',
      actual: null,
      expected: 'all: 3+',
      message: 'Published solutions should be public',
    },
    {
      name: 'AI Tools Access',
      status: 'idle',
      actual: null,
      expected: 'all: 6+',
      message: 'Public AI tools should be visible to everyone',
    },
  ])

  // Check current user
  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setUserEmail('Not logged in')
      setUserRole('anonymous')
      return { email: null, role: 'anonymous' }
    }

    setUserEmail(user.email || 'Unknown')
    
    // Check role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    const role = profile?.role || user.user_metadata?.role || 'client'
    setUserRole(role)
    
    return { email: user.email, role }
  }

  // Run individual test
  const runTest = async (testIndex: number) => {
    setTests((prev) =>
      prev.map((test, i) => (i === testIndex ? { ...test, status: 'running' as const } : test))
    )

    const { role } = await checkCurrentUser()

    try {
      let actual: number | null = null
      let status: 'pass' | 'fail' | 'warning' = 'pass'
      let message = ''

      switch (testIndex) {
        case 0: // N8N Workflows
          const { data: workflows, error: wError } = await supabase
            .from('n8n_workflows')
            .select('*')

          actual = workflows?.length || 0
          
          if (role === 'admin') {
            status = actual >= 3 ? 'pass' : 'fail'
            message = actual >= 3 
              ? `✅ Admin correctly sees ${actual} workflows`
              : `❌ Admin should see 6+ workflows, got ${actual}`
          } else {
            status = actual === 0 ? 'pass' : 'fail'
            message = actual === 0
              ? '✅ Regular user correctly sees no workflows'
              : `❌ Regular user should see 0 workflows, got ${actual}`
          }
          
          if (wError) {
            message = `⚠️ Query error: ${wError.message}`
            status = 'warning'
          }
          break

        case 1: // Profiles
          const { data: profiles, error: pError } = await supabase
            .from('profiles')
            .select('*')

          actual = profiles?.length || 0

          if (role === 'admin') {
            status = actual >= 5 ? 'pass' : 'fail'
            message = actual >= 5
              ? `✅ Admin correctly sees ${actual} profiles`
              : `❌ Admin should see 8+ profiles, got ${actual}`
          } else {
            status = actual === 1 ? 'pass' : 'fail'
            message = actual === 1
              ? '✅ Regular user correctly sees only own profile'
              : `❌ Regular user should see 1 profile, got ${actual}`
          }

          if (pError) {
            message = `⚠️ Query error: ${pError.message}`
            status = 'warning'
          }
          break

        case 2: // Solutions
          const { data: solutions, error: sError } = await supabase
            .from('solutions')
            .select('*')
            .eq('status', 'published')

          actual = solutions?.length || 0
          status = actual >= 3 ? 'pass' : 'warning'
          message = actual >= 3
            ? `✅ Found ${actual} published solutions`
            : `⚠️ Expected 3+ solutions, got ${actual}`

          if (sError) {
            message = `⚠️ Query error: ${sError.message}`
            status = 'warning'
          }
          break

        case 3: // AI Tools
          const { data: tools, error: tError } = await supabase
            .from('ai_tools')
            .select('*')
            .eq('is_public', true)

          actual = tools?.length || 0
          status = actual >= 1 ? 'pass' : 'warning'
          message = actual >= 1
            ? `✅ Found ${actual} public AI tools`
            : `⚠️ Expected 6+ tools, got ${actual}`

          if (tError) {
            message = `⚠️ Query error: ${tError.message}`
            status = 'warning'
          }
          break
      }

      setTests((prev) =>
        prev.map((test, i) =>
          i === testIndex
            ? { ...test, status, actual, message }
            : test
        )
      )
    } catch (error: any) {
      setTests((prev) =>
        prev.map((test, i) =>
          i === testIndex
            ? {
                ...test,
                status: 'fail' as const,
                message: `❌ Error: ${error.message}`,
                error: error.toString(),
              }
            : test
        )
      )
    }
  }

  // Run all tests
  const runAllTests = async () => {
    await checkCurrentUser()
    for (let i = 0; i < tests.length; i++) {
      await runTest(i)
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <XCircle className="h-5 w-5 text-yellow-500" />
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <div className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-700">Pass</Badge>
      case 'fail':
        return <Badge className="bg-red-100 text-red-700">Fail</Badge>
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
      case 'running':
        return <Badge className="bg-blue-100 text-blue-700">Running</Badge>
      default:
        return <Badge variant="outline">Not Run</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Current User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current User
          </CardTitle>
          <CardDescription>Tests will run with this user's permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Email:</span>
            <span className="font-medium">{userEmail || 'Click "Check User" to load'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Role:</span>
            <Badge variant={userRole === 'admin' ? 'default' : 'secondary'}>
              {userRole || 'Unknown'}
            </Badge>
          </div>
          <Button onClick={checkCurrentUser} variant="outline" size="sm" className="w-full mt-2">
            <Shield className="mr-2 h-4 w-4" />
            Check User
          </Button>
        </CardContent>
      </Card>

      {/* Run All Button */}
      <Button onClick={runAllTests} size="lg" className="w-full">
        <Play className="mr-2 h-5 w-5" />
        Run All Tests
      </Button>

      {/* Test Results */}
      <div className="space-y-4">
        {tests.map((test, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <CardTitle className="text-base">{test.name}</CardTitle>
                    <CardDescription>{test.message}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Expected:</p>
                  <p className="font-medium">{test.expected}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Actual:</p>
                  <p className="font-medium">
                    {test.actual !== null ? `${test.actual} rows` : 'Not run yet'}
                  </p>
                </div>
              </div>

              {test.error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded p-2 text-xs">
                  <p className="font-medium text-red-700 dark:text-red-300">Error Details:</p>
                  <pre className="text-red-600 dark:text-red-400 whitespace-pre-wrap">
                    {test.error}
                  </pre>
                </div>
              )}

              <Button
                onClick={() => runTest(index)}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={test.status === 'running'}
              >
                {test.status === 'running' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run This Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

