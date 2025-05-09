"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { formatDistanceToNow } from "date-fns"

export default function AssessmentsPage() {
  const router = useRouter()
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        // Check authentication
        const token = localStorage.getItem("admin-token")
        if (!token) {
          router.push("/login")
          return
        }

        // Fetch assessments
        const res = await fetch("/api/admin/assessments")

        if (!res.ok) {
          throw new Error("Failed to fetch assessments")
        }

        const data = await res.json()
        setAssessments(data.assessments)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/admin")}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Assessments</h1>
          <Button>Export Data</Button>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>{assessment.id}</TableCell>
                  <TableCell>
                    {assessment.first_name} {assessment.last_name}
                  </TableCell>
                  <TableCell>{assessment.email}</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}</TableCell>
                  <TableCell>{assessment.score || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assessment.status === "completed"
                          ? "default"
                          : assessment.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {assessment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}
