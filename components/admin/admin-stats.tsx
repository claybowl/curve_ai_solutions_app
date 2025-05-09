"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MessageSquare, ClipboardList, FileText } from "lucide-react"

export function AdminStats() {
  const [stats, setStats] = useState({
    users: 42,
    consultationRequests: 18,
    assessmentCompletions: 24,
    generatedReports: 15,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real implementation, we would fetch these stats from the API
    // For now, we'll just simulate a loading state
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className={loading ? "animate-pulse" : ""}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          <Users className="h-6 w-6 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.users}</div>
          <p className={`text-xs text-green-500`}>+12% from last month</p>
        </CardContent>
      </Card>

      <Card className={loading ? "animate-pulse" : ""}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Consultation Requests</CardTitle>
          <MessageSquare className="h-6 w-6 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.consultationRequests}</div>
          <p className={`text-xs text-green-500`}>+5 new this week</p>
        </CardContent>
      </Card>

      <Card className={loading ? "animate-pulse" : ""}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Assessment Completions</CardTitle>
          <ClipboardList className="h-6 w-6 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.assessmentCompletions}</div>
          <p className={`text-xs text-green-500`}>+8 from last month</p>
        </CardContent>
      </Card>

      <Card className={loading ? "animate-pulse" : ""}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Generated Reports</CardTitle>
          <FileText className="h-6 w-6 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.generatedReports}</div>
          <p className={`text-xs text-green-500`}>+3 this week</p>
        </CardContent>
      </Card>
    </div>
  )
}
