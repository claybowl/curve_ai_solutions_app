"use client"

import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"

export function PendingConsultations() {
  // Sample data - would come from API in real application
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      first_name: "Michael",
      last_name: "Brown",
      company_name: "Global Manufacturing",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      first_name: "Sarah",
      last_name: "Johnson",
      company_name: "Tech Solutions",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 3,
      first_name: "David",
      last_name: "Wilson",
      company_name: "Finance Pro",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
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
        <CardTitle>Pending Consultations</CardTitle>
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
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.length > 0 ? (
              consultations.map((consultation) => (
                <div key={consultation.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {consultation.first_name} {consultation.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{consultation.company_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(consultation.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No pending consultations</p>
            )}
          </div>
        )}
      </CardContent>
    </>
  )
}
