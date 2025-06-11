import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentAssessments } from "@/components/admin/recent-assessments"
import { PendingConsultations } from "@/components/admin/pending-consultations"

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  // Verify user is authenticated and has admin role
  if (error || !user) {
    redirect("/auth/signin?callbackUrl=/admin-dashboard")
  }

  // Get user role from metadata
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  
  if (userRole !== "admin") {
    redirect("/auth/signin?callbackUrl=/admin-dashboard")
  }

  // User is authenticated as admin
  const firstName = user.user_metadata?.firstName || user.user_metadata?.first_name || user.email?.split('@')[0] || 'Admin'
  const lastName = user.user_metadata?.lastName || user.user_metadata?.last_name || ''

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {firstName} {lastName}
      </p>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentAssessments />
        <PendingConsultations />
      </div>
    </div>
  )
}