"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bot, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockWorkflows = [
  { id: "1", name: "Consultation Alert", status: "active", lastRun: "2 hours ago" },
  { id: "2", name: "Lead Qualification", status: "active", lastRun: "1 hour ago" },
  { id: "3", name: "Weekly Report", status: "inactive", lastRun: "3 days ago" },
]

export default function AIAgentsPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          AI Agents & Workflows
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage n8n automation workflows
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWorkflows.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configured workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWorkflows.filter(w => w.status === "active").length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Running workflows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockWorkflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bot className="h-5 w-5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{workflow.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last run: {workflow.lastRun}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                    {workflow.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
