import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConsultationManagementTable } from "@/components/admin-dashboard/consultation-management-table"
import { getAllConsultations } from "@/app/actions/admin-dashboard-actions"

export default async function ConsultationsPage() {
  const { data: consultations, error } = await getAllConsultations()

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
