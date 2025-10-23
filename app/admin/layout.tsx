import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { getCurrentSupabaseUser } from "@/lib/db-v2"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SERVER-SIDE AUTH CHECK - CRITICAL SECURITY!
  const user = await getCurrentSupabaseUser()

  if (!user) {
    redirect('/login?message=Please log in to access the admin area&callbackUrl=/admin')
  }

  // Check if user is admin
  const supabase = await createServerSupabaseClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard?message=Unauthorized - Admin access required')
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
