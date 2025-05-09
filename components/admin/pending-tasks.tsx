import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export async function PendingTasks() {
  // In a real implementation, you would fetch this data from your database
  const tasks = [
    {
      id: 1,
      title: "Review consultation request from Acme Inc.",
      priority: "high",
      dueDate: "Today",
    },
    {
      id: 2,
      title: "Generate assessment report for Tech Solutions",
      priority: "medium",
      dueDate: "Tomorrow",
    },
    {
      id: 3,
      title: "Follow up with Global Manufacturing",
      priority: "medium",
      dueDate: "In 2 days",
    },
    {
      id: 4,
      title: "Update monthly analytics dashboard",
      priority: "low",
      dueDate: "Next week",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-4">
              <div
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                }`}
              >
                {task.priority}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">Due: {task.dueDate}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">Complete</span>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
