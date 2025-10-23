import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Users, Calendar, FileText, BarChart3 } from "lucide-react"

async function getStats() {
  const supabase = await createServerSupabaseClient()

  try {
    // Get user count
    const { count: userCount } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    // Get pending consultations count
    const { count: pendingConsultations } = await supabase
      .from("consultations")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    // Get completed assessments count
    const { count: completedAssessments } = await supabase
      .from("assessments")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed")

    // Get total assessments count
    const { count: totalAssessments } = await supabase
      .from("assessments")
      .select("*", { count: "exact", head: true })

    return {
      userCount: userCount || 0,
      pendingConsultations: pendingConsultations || 0,
      completedAssessments: completedAssessments || 0,
      totalAssessments: totalAssessments || 0,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      userCount: 0,
      pendingConsultations: 0,
      completedAssessments: 0,
      totalAssessments: 0,
    }
  }
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color,
}: {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  description?: string
  color: "blue" | "green" | "orange" | "purple"
}) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function AdminDashboardHome() {
  const stats = await getStats()
  const { data: { user } } = await createServerSupabaseClient().then(
    (client) => client.auth.getUser()
  )

  const firstName = user?.user_metadata?.firstName || "Admin"

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {firstName}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Here's what's happening on your platform today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.userCount}
          icon={Users}
          color="blue"
          description="Active user accounts"
        />
        <StatCard
          title="Pending Consultations"
          value={stats.pendingConsultations}
          icon={Calendar}
          color="orange"
          description="Awaiting response"
        />
        <StatCard
          title="Completed Assessments"
          value={stats.completedAssessments}
          icon={FileText}
          color="green"
          description={`of ${stats.totalAssessments} total`}
        />
        <StatCard
          title="Total Assessments"
          value={stats.totalAssessments}
          icon={BarChart3}
          color="purple"
          description="All time"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Navigation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin-dashboard/users"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Users className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Manage Users
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View and edit user accounts
            </p>
          </a>

          <a
            href="/admin-dashboard/consultations"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <Calendar className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Consultations
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Review and respond to requests
            </p>
          </a>

          <a
            href="/admin-dashboard/database"
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors"
          >
            <BarChart3 className="h-6 w-6 text-primary mb-2" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Database Browser
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Browse all tables and records
            </p>
          </a>
        </div>
      </div>
    </main>
  )
}
