import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { ConsultationManagementTable } from "@/components/admin-dashboard/consultation-management-table"

export default async function ConsultationsPage() {
  const supabase = await createServerSupabaseClient()

  // Fetch all consultations with user info
  const { data: consultations, error } = await supabase
    .from("consultations")
    .select(
      `
      *,
      profiles:user_id (email, first_name, last_name, company_name)
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching consultations:", error)
  }

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Consultations
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage and respond to consultation requests
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Consultation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationManagementTable consultations={consultations || []} />
        </CardContent>
      </Card>
    </main>
  )
}
