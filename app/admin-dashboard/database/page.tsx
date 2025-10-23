"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Search } from "lucide-react"

const AVAILABLE_TABLES = [
  { name: "profiles", label: "User Profiles" },
  { name: "assessments", label: "Assessments" },
  { name: "assessment_questions", label: "Assessment Questions" },
  { name: "assessment_responses", label: "Assessment Responses" },
  { name: "assessment_categories", label: "Assessment Categories" },
  { name: "assessment_results", label: "Assessment Results" },
  { name: "consultations", label: "Consultations" },
  { name: "ai_tools", label: "AI Tools" },
  { name: "tool_categories", label: "Tool Categories" },
  { name: "user_tool_usage", label: "Tool Usage" },
  { name: "prompts", label: "Prompts" },
  { name: "prompt_categories", label: "Prompt Categories" },
  { name: "user_prompt_collections", label: "Prompt Collections" },
  { name: "prompt_collection_items", label: "Collection Items" },
  { name: "analytics_events", label: "Analytics Events" },
  { name: "user_engagement_metrics", label: "Engagement Metrics" },
  { name: "notification_templates", label: "Notification Templates" },
  { name: "user_notifications", label: "User Notifications" },
  { name: "blog_posts", label: "Blog Posts" },
  { name: "n8n_workflows", label: "N8N Workflows" },
  { name: "n8n_workflow_executions", label: "Workflow Executions" },
]

export default function DatabaseBrowserPage() {
  const [selectedTable, setSelectedTable] = useState("profiles")
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [recordCount, setRecordCount] = useState(0)

  useEffect(() => {
    fetchTableData()
  }, [selectedTable])

  const fetchTableData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/database/browse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableName: selectedTable }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch data")
      }

      const result = await response.json()
      setData(result.data || [])
      setRecordCount(result.count || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = data.filter((row) =>
    JSON.stringify(row).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = data.length > 0 ? Object.keys(data[0]) : []

  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Database Browser
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Browse and search all database tables
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected Table
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {AVAILABLE_TABLES.find((t) => t.name === selectedTable)?.label}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Records
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {recordCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">Columns</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {columns.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Table Selection & Search</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Table
            </label>
            <Select value={selectedTable} onValueChange={setSelectedTable}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-96">
                {AVAILABLE_TABLES.map((table) => (
                  <SelectItem key={table.name} value={table.name}>
                    {table.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search in table..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button onClick={fetchTableData} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh Data"
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Data ({filteredData.length} / {data.length} records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredData.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No records found</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.slice(0, 5).map((col) => (
                      <TableHead key={col} className="max-w-xs truncate">
                        {col}
                      </TableHead>
                    ))}
                    {columns.length > 5 && (
                      <TableHead className="text-xs text-gray-500">
                        +{columns.length - 5} more columns
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.slice(0, 50).map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.slice(0, 5).map((col) => (
                        <TableCell
                          key={`${idx}-${col}`}
                          className="max-w-xs truncate text-sm"
                          title={String(row[col])}
                        >
                          {typeof row[col] === "object"
                            ? JSON.stringify(row[col])
                            : String(row[col] || "")}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredData.length > 50 && (
                <p className="text-xs text-gray-500 mt-2">
                  Showing first 50 records
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
