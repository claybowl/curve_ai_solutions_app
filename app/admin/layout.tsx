import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/stack-auth-server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SERVER-SIDE AUTH CHECK - CRITICAL SECURITY!
  // Stack Auth handles authentication and admin permission checking
  try {
    await requireAdmin()
  } catch (error) {
    // If not authenticated, redirect to login
    // If authenticated but not admin, redirect to dashboard
    const isAuthError = error instanceof Error && error.message.includes('authentication required')
    if (isAuthError) {
      redirect('/login?message=Please log in to access the admin area&callbackUrl=/admin')
    } else {
      redirect('/dashboard?message=Unauthorized - Admin access required')
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="lg:pl-0 pl-2">
          {children}
        </div>
      </main>
    </div>
  )
}
