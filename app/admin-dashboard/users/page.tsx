import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserManagementTable } from "@/components/admin-dashboard/user-management-table"
import { getAllUsers } from "@/app/actions/admin-dashboard-actions"

export default async function UsersPage() {
  const { data: users, error } = await getAllUsers()

  if (error) {
    console.error("Error fetching users:", error)
  }

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
          <UserManagementTable users={users || []} />
        </CardContent>
      </Card>
    </main>
  )
}
