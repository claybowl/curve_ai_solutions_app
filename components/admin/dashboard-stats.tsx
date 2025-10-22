import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Calendar, Wrench } from "lucide-react"

async function getStats() {
  try {
    // Check if DATABASE_URL is available before attempting database queries
    if (!process.env.DATABASE_URL) {
      console.log("DATABASE_URL not available, using mock stats")
      return {
        userCount: 0,
        assessmentCount: 0,
        pendingAssessments: 0,
        toolCount: 0,
      }
    }

    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL)

    const userCount = await sql`SELECT COUNT(*) FROM users`
    const assessmentCount = await sql`SELECT COUNT(*) FROM ai_assessments`
    const pendingAssessments = await sql`SELECT COUNT(*) FROM ai_assessments WHERE status = 'pending'`
    const toolCount = await sql`SELECT COUNT(*) FROM ai_tools`

    return {
      userCount: userCount[0].count,
      assessmentCount: assessmentCount[0].count,
      pendingAssessments: pendingAssessments[0].count,
      toolCount: toolCount[0].count,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return mock data if there's an error
    return {
      userCount: 0,
      assessmentCount: 0,
      pendingAssessments: 0,
      toolCount: 0,
    }
  }
}

export async function DashboardStats() {
  const stats = await getStats()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.userCount}</div>
          <p className="text-xs text-muted-foreground">Registered accounts</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Assessments</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.assessmentCount}</div>
          <p className="text-xs text-muted-foreground">Total assessments</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingAssessments}</div>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">AI Tools</CardTitle>
          <Wrench className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.toolCount}</div>
          <p className="text-xs text-muted-foreground">Available tools</p>
        </CardContent>
      </Card>
    </div>
  )
}
