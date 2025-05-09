import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getUserFromCookie() {
  const cookieStore = cookies()
  const adminAuth = cookieStore.get("admin-auth")

  if (!adminAuth) {
    return null
  }

  const [userId, role] = adminAuth.value.split(":")

  if (role !== "admin") {
    return null
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT id, email, first_name, last_name, role
      FROM users
      WHERE id = ${userId} AND role = 'admin'
    `

    if (users.length === 0) {
      return null
    }

    return users[0]
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function AdminSimplePage() {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Dashboard (Simple)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Welcome, {user.first_name} {user.last_name}!
            </p>
            <p>
              Your role is: <strong>{user.role}</strong>
            </p>
            <p>Your email is: {user.email}</p>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p className="text-green-800 dark:text-green-300">You have successfully logged in to the admin area!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
