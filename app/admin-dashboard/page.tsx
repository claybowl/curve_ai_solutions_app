import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentAssessments } from "@/components/admin/recent-assessments"
import { PendingConsultations } from "@/components/admin/pending-consultations"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  // Verify user is authenticated and has admin role
  if (!session || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin-dashboard")
  }

  // User is authenticated as admin
  const { firstName, lastName } = session.user

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