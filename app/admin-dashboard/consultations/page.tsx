"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConsultationManagementTable } from "@/components/admin-dashboard/consultation-management-table"

const mockConsultations = [
  { id: "1", first_name: "John", last_name: "Doe", email: "john@example.com", company_name: "Acme Corp", status: "pending", created_at: new Date().toISOString() },
  { id: "2", first_name: "Jane", last_name: "Smith", email: "jane@example.com", company_name: "Tech Startup", status: "in_progress", created_at: new Date().toISOString() },
]

export default function ConsultationsPage() {
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
          <ConsultationManagementTable consultations={mockConsultations} />
        </CardContent>
      </Card>
    </main>
  )
}
