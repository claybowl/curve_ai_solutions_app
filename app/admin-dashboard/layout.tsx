import type React from "react"
import { AdminDashboardSidebar } from "@/components/admin-dashboard/admin-dashboard-sidebar"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SERVER-SIDE AUTH CHECK - CRITICAL SECURITY!
  const supabase = await createServerSupabaseClient()

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?message=Please log in to access the admin area&callbackUrl=/admin-dashboard')
  }

  // Check if user is admin
  // Users can read their own profile, so use the authenticated client
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    redirect('/dashboard?message=Unauthorized - Admin access required')
  }

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="lg:pl-0 pl-2">
          {children}
        </div>
      </main>
    </div>
  )
}
