import { cookies } from "next/headers"
import { neon } from "@neondatabase/serverless"

export default async function DebugAuthPage() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get("simple-admin-auth")

  let userData = null
  let sqlError = null

  if (authCookie) {
    const parts = authCookie.value.split(":")
    if (parts.length >= 2) {
      const userId = parts[0]

      try {
        const sql = neon(process.env.DATABASE_URL!)
        const users = await sql`
          SELECT id, email, first_name, last_name, role
          FROM users
          WHERE id = ${userId}
        `

        if (users.length > 0) {
          userData = users[0]
        }
      } catch (error) {
        sqlError = error instanceof Error ? error.message : String(error)
      }
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Debug</h1>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h2 className="text-xl font-bold mb-2">Cookie Information</h2>
          {authCookie ? (
            <div>
              <p>
                <strong>Name:</strong> {authCookie.name}
              </p>
              <p>
                <strong>Value:</strong> {authCookie.value}
              </p>
              <p>
                <strong>Path:</strong> {authCookie.path}
              </p>
              <p>
                <strong>Expires:</strong> {authCookie.expires ? new Date(authCookie.expires).toISOString() : "N/A"}
              </p>

              <div className="mt-2">
                <p>
                  <strong>Parsed Values:</strong>
                </p>
                {authCookie.value.split(":").map((part, index) => (
                  <p key={index}>
                    {index === 0 ? "User ID: " : index === 1 ? "Role: " : "Timestamp: "}
                    {part}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-600">No auth cookie found</p>
          )}
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h2 className="text-xl font-bold mb-2">User Information</h2>
          {userData ? (
            <div>
              <p>
                <strong>ID:</strong> {userData.id}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Name:</strong> {userData.first_name} {userData.last_name}
              </p>
              <p>
                <strong>Role:</strong> {userData.role}
              </p>
            </div>
          ) : (
            <p className="text-red-600">No user data found</p>
          )}

          {sqlError && (
            <div className="mt-2 p-2 bg-red-50 text-red-800 rounded">
              <p>
                <strong>SQL Error:</strong> {sqlError}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h2 className="text-xl font-bold mb-2">All Cookies</h2>
          <pre className="p-2 bg-gray-100 rounded overflow-auto text-xs">
            {JSON.stringify(
              cookieStore.getAll().map((c) => ({ name: c.name, value: c.value })),
              null,
              2,
            )}
          </pre>
        </div>
      </div>
    </div>
  )
}
