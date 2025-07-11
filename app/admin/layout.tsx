import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
