"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function MigrateAuthPage() {
  const [defaultPassword, setDefaultPassword] = useState("ChangeMe123!")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [step, setStep] = useState<"setup" | "migrate" | "confirm" | "complete">("setup")

  // Set up database for migration
  async function setupDatabase() {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/migrate-to-supabase/setup', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || "Failed to set up database")
        return
      }
      
      setStep("migrate")
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }
  
  // Confirm migration
  function confirmMigration() {
    setStep("confirm")
  }
  
  // Run migration
  async function runMigration() {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/admin/migrate-to-supabase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ defaultPassword }),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || "Migration failed")
        return
      }
      
      setResult(data.result)
      setStep("complete")
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-8">Migrate Authentication to Supabase</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {step === "setup" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Set Up Database</CardTitle>
            <CardDescription>
              This will prepare your database for migration by adding UUID columns to tables that reference users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={setupDatabase} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Set Up Database"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {step === "migrate" && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Migrate Users</CardTitle>
            <CardDescription>
              Set a default password for all migrated users. They can reset their passwords later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultPassword">Default Password</Label>
                <Input
                  id="defaultPassword"
                  value={defaultPassword}
                  onChange={(e) => setDefaultPassword(e.target.value)}
                  type="text"
                />
                <p className="text-sm text-muted-foreground">
                  This password will be used for all migrated users.
                </p>
              </div>
              
              <Button onClick={confirmMigration}>Continue to Confirmation</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {step === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Migration</CardTitle>
            <CardDescription>
              This will migrate all users from your existing database to Supabase Auth.
              This process cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  <p>All users will be migrated with the default password: <strong>{defaultPassword}</strong></p>
                  <p className="mt-2">Make sure you have created an admin user in Supabase before proceeding.</p>
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-4">
                <Button onClick={runMigration} disabled={loading} variant="destructive">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Migrating...
                    </>
                  ) : (
                    "Start Migration"
                  )}
                </Button>
                <Button onClick={() => setStep("migrate")} variant="outline" disabled={loading}>
                  Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {step === "complete" && result && (
        <Card>
          <CardHeader>
            <CardTitle>Migration Complete</CardTitle>
            <CardDescription>
              Users have been migrated to Supabase Auth.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <p><strong>Total Users:</strong> {result.totalUsers}</p>
                <p><strong>Successfully Migrated:</strong> {result.migratedUsers}</p>
                <p><strong>Failed:</strong> {result.failedUsers}</p>
              </div>
              
              {result.details && result.details.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">DB ID</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Supabase ID</th>
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.details.map((user: any, index: number) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{user.dbId}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2 font-mono text-xs">{user.supabaseUserId || '-'}</td>
                          <td className="p-2">
                            {user.success ? (
                              <span className="text-green-600">Success</span>
                            ) : (
                              <span className="text-red-600">Failed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <Button onClick={() => window.location.href = '/admin'}>
                Return to Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}