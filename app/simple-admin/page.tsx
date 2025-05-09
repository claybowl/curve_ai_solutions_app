import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { neon } from "@neondatabase/serverless"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminActions } from "@/components/admin/admin-actions"

async function getUserFromCookie() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get("simple-admin-auth")

  console.log("Cookie check in simple-admin:", authCookie?.value)

  if (!authCookie) {
    console.log("No auth cookie found")
    return null
  }

  // The cookie format is userId:role:timestamp
  const parts = authCookie.value.split(":")
  if (parts.length < 2) {
    console.log("Invalid cookie format")
    return null
  }

  const [userId, role] = parts
  console.log(`Found cookie with userId: ${userId}, role: ${role}`)

  if (role !== "admin") {
    console.log("User is not an admin")
    return null
  }

  try {
    const sql = neon(process.env.DATABASE_URL!)
    const users = await sql`
      SELECT id, email, first_name, last_name, role
      FROM users
      WHERE id = ${userId}
    `

    console.log(`Found ${users.length} users matching userId ${userId}`)

    if (users.length === 0) {
      console.log("No user found with that ID")
      return null
    }

    // Check if the user is an admin
    if (users[0].role !== "admin") {
      console.log("User found but not an admin")
      return null
    }

    console.log("User authenticated successfully")
    return users[0]
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export default async function SimpleAdminPage() {
  const user = await getUserFromCookie()

  if (!user) {
    console.log("Redirecting to login - no valid user found")
    redirect("/simple-login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Admin Dashboard</CardTitle>
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

            <AdminActions />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
