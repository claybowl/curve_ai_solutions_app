"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagementTable } from "@/components/admin-dashboard/user-management-table"

const mockUsers = [
  { id: "1", email: "admin@curveai.com", first_name: "Admin", last_name: "User", role: "admin", status: "active", created_at: new Date().toISOString() },
  { id: "2", email: "user@example.com", first_name: "John", last_name: "Doe", role: "client", status: "active", created_at: new Date().toISOString() },
]

export default function UsersPage() {
  return (
    <main className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage user accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserManagementTable users={mockUsers} />
        </CardContent>
      </Card>
    </main>
  )
}
