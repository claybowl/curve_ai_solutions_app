import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { AssessmentManagementTable } from "@/components/admin-dashboard/assessment-management-table"

export default async function AssessmentsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch all assessments with user info
  const { data: assessments, error } = await supabase
    .from("assessments")
    .select(
      `
      *,
      profiles:user_id (email, first_name, last_name, company_name)
    `
    )
    .order("created_at", { ascending: false })

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
