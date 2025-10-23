import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AssessmentManagementTable } from "@/components/admin-dashboard/assessment-management-table"
import { getAllAssessments } from "@/app/actions/admin-dashboard-actions"

export default async function AssessmentsPage() {
  const { data: assessments, error } = await getAllAssessments()

  if (error) {
    console.error("Error fetching assessments:", error)
  }

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
          <AssessmentManagementTable assessments={assessments || []} />
        </CardContent>
      </Card>
    </main>
  )
}
