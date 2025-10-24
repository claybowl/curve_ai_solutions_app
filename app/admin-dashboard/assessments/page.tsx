"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AssessmentManagementTable } from "@/components/admin-dashboard/assessment-management-table"

const mockAssessments = [
  { id: "1", user_id: "2", score: 75, status: "completed", completion_percentage: 75, created_at: new Date().toISOString() },
  { id: "2", user_id: "3", score: 88, status: "completed", completion_percentage: 88, created_at: new Date().toISOString() },
]

export default function AssessmentsPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Assessments
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage AI assessments
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <AssessmentManagementTable assessments={mockAssessments} />
        </CardContent>
      </Card>
    </main>
  )
}
