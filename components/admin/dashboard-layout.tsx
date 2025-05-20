"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getCurrentUser } from "@/lib/supabase"

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; href: string; current?: boolean }>
  actions?: ReactNode
}

const DashboardLayout = ({
  children,
  title,
  description,
  breadcrumbs,
  actions,
}: DashboardLayoutProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // Get the current user from Supabase
        const { user, error } = await getCurrentUser()
        
        if (error || !user) {
          console.error("Error fetching user:", error)
          router.push("/login")
          return
        }

        // Check if user is an admin
        const isUserAdmin = user.user_metadata?.role === "admin"
        setIsAdmin(isUserAdmin)
        
        if (!isUserAdmin) {
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("Error checking admin status:", err)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card className="border-red-200 my-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-bold">Access Denied</h2>
            </div>
            <p>You don't have permission to access this admin area.</p>
            <div className="mt-4 flex gap-4">
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto min-h-screen">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="overflow-x-auto pb-2">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbs.length - 1 ? (
                    <>
                      <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  ) : (
                    <BreadcrumbLink href={crumb.href} className="font-semibold">
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-1 text-sm sm:text-base">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>

      {children}
    </div>
  )
}

export { DashboardLayout }