"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { formatDistanceToNow } from "date-fns"
import { getAllAssessments } from "@/app/actions/assessment-actions"

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllAssessments()
        setAssessments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <DashboardLayout
        title="Assessments"
        description="Manage AI assessments and results"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Assessments", href: "/admin/assessments", current: true }
        ]}
        actions={<Button>Export Data</Button>}
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Assessments"
        description="Manage AI assessments and results"
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Assessments", href: "/admin/assessments", current: true }
        ]}
      >
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Assessments"
      description="Manage AI assessments and results"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Assessments", href: "/admin/assessments", current: true }
      ]}
      actions={<Button>Export Data</Button>}
    >
      <Card>
        <CardContent className="p-0">
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
              {assessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No assessments found
                  </TableCell>
                </TableRow>
              ) : (
                assessments.map((assessment) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
