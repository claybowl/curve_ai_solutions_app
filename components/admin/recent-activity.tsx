import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export async function RecentActivity() {
  // In a real implementation, you would fetch this data from your database
  const activities = [
    {
      id: 1,
      type: "consultation",
      user: "John Smith",
      company: "Acme Inc.",
      action: "Submitted consultation request",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "assessment",
      user: "Sarah Johnson",
      company: "Tech Solutions",
      action: "Completed AI readiness assessment",
      time: "5 hours ago",
    },
    {
      id: 3,
      type: "user",
      user: "Michael Brown",
      company: "Global Manufacturing",
      action: "Created new account",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "report",
      user: "Admin",
      company: "Curve AI",
      action: "Generated monthly analytics report",
      time: "2 days ago",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/activity">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div
                className={`w-2 h-2 mt-2 rounded-full ${
                  activity.type === "consultation"
                    ? "bg-blue-500"
                    : activity.type === "assessment"
                      ? "bg-purple-500"
                      : activity.type === "user"
                        ? "bg-green-500"
                        : "bg-orange-500"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {activity.user} ({activity.company})
                </p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
