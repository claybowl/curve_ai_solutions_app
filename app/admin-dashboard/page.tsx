import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentAssessments } from "@/components/admin/recent-assessments"
import { PendingConsultations } from "@/components/admin/pending-consultations"

async function getUserFromCookie() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get("simple-admin-auth")

  if (!authCookie) {
    return null
  }

  const [userId, role] = authCookie.value.split(":")

  if (role !== "admin") {
    return null
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT id, email, first_name, last_name, role
      FROM users
      WHERE id = ${userId} AND role = 'admin'
    `

    if (users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function AdminDashboardPage() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/simple-login")
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome back, {user.first_name} {user.last_name}
      </p>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentAssessments />
        <PendingConsultations />
      </div>
    </div>
  )
}
