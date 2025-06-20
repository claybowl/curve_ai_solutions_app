"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SupabaseUserList } from "@/components/admin/supabase-user-list"
import { DashboardLayout } from "@/components/admin/dashboard-layout"

export default function UsersPage() {
  return (
    <DashboardLayout
      title="User Management"
      description="Manage user accounts and access permissions"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Users", href: "/admin/users", current: true }
      ]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Supabase Users</CardTitle>
        </CardHeader>
        <CardContent>
          <SupabaseUserList />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
