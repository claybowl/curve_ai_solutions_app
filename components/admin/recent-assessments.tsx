"use client"

import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export function RecentAssessments() {
  // Sample data - would come from API in real application
  const [assessments, setAssessments] = useState([
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      status: "completed",
      score: 78,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      first_name: "Jane",
      last_name: "Smith",
      status: "pending",
      score: null,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      first_name: "Robert",
      last_name: "Johnson",
      status: "completed",
      score: 92,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 4,
      first_name: "Emily",
      last_name: "Davis",
      status: "completed",
      score: 65,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch data from API
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return (
    <>
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-24 bg-gray-100 rounded mt-2"></div>
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {assessment.first_name} {assessment.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {assessment.score && <span className="text-sm font-medium">Score: {assessment.score}</span>}
                  <Badge
                    variant={
                      assessment.status === "completed"
                        ? "default"
                        : assessment.status === "pending"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {assessment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </>
  )
}
