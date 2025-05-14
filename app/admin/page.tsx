"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { RecentAssessments } from "@/components/admin/recent-assessments"
import { PendingConsultations } from "@/components/admin/pending-consultations"
import { AdminStats } from "@/components/admin/admin-stats"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState("")

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-red-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-bold">Error</h2>
            </div>
            <p>{error}</p>
            <div className="mt-4 flex gap-4">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" asChild>
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Only render if we've confirmed this is an admin
  if (status !== "authenticated" || session?.user?.role !== "admin") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  const user = session.user

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {user?.firstName || user?.name?.split(' ')[0]} {user?.lastName || user?.name?.split(' ')[1] || ''}
      </p>

      <AdminStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="p-0">
            <RecentAssessments />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <PendingConsultations />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
