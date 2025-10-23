// Auth is handled by app/admin/layout.tsx - no need for duplicate client-side checks
import { Card, CardContent } from "@/components/ui/card"
import { RecentAssessments } from "@/components/admin/recent-assessments"
import { PendingConsultations } from "@/components/admin/pending-consultations"
import { AdminStats } from "@/components/admin/admin-stats"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function AdminDashboardPage() {
  // Get user info for display (auth already verified in layout)
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Extract user metadata
  const metadata = user?.user_metadata || {}
  const firstName = metadata.firstName || user?.email?.split('@')[0] || 'Admin'
  const lastName = metadata.lastName || ''

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {firstName} {lastName}
      </p>

      <AdminStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="p-0">
            <RecentAssessments />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <PendingConsultations />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
