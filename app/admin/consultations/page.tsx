import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConsultationList } from "@/components/admin/consultation-list"
import { DashboardLayout } from "@/components/admin/dashboard-layout"

export default async function ConsultationsPage() {
  return (
    <DashboardLayout
      title="Consultation Requests"
      description="Manage and respond to consultation requests from clients"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Consultations", href: "/admin/consultations", current: true }
      ]}
      actions={
        <div className="flex gap-4">
          <Button variant="outline">Export</Button>
          <Button>New Consultation</Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>All Consultation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationList />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
