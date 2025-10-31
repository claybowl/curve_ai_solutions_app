"use client"

import React, { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useAuth } from "@/providers/stack-auth-provider"

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
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check admin status from Stack Auth user permissions
    if (authLoading) {
      return // Still loading
    }

    if (!user) {
      router.push("/login")
      return
    }

    const permissions = (user as any).permissions || []
    const adminStatus = Array.isArray(permissions) && permissions.includes('admin')
    setIsAdmin(adminStatus)
    
    if (!adminStatus) {
      router.push("/dashboard")
    }
  }, [user, authLoading, router])

  if (authLoading) {
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
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={crumb.href} className={index === breadcrumbs.length - 1 ? "font-semibold" : ""}>
                      {crumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
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