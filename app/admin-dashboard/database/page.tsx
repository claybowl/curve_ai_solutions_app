"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "lucide-react"

const mockTables = [
  { name: "profiles", rows: 42, status: "active" },
  { name: "consultations", rows: 34, status: "active" },
  { name: "assessments", rows: 128, status: "active" },
  { name: "n8n_workflows", rows: 3, status: "active" },
]

export default function DatabasePage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Database Browser
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse and manage database tables
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTables.map((table) => (
              <div key={table.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{table.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{table.rows} rows</p>
                  </div>
                </div>
                <Badge variant={table.status === "active" ? "default" : "secondary"}>
                  {table.status}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click on a table above to view its data. Full database integration coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
