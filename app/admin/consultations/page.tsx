import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ConsultationList } from "@/components/admin/consultation-list"

export default async function ConsultationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1A365D] mb-2">Consultation Requests</h1>
          <p className="text-gray-500">Manage and respond to consultation requests from clients.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Export</Button>
          <Button>New Consultation</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Consultation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationList />
        </CardContent>
      </Card>
    </div>
  )
}
