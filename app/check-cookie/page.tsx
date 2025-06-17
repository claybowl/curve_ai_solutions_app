import { cookies } from "next/headers"

// This page uses cookies, so it cannot be statically generated
export const dynamic = 'force-dynamic'

export default function CheckCookiePage() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get("simple-admin-auth")

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Cookie Check</h1>

      {authCookie ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="font-medium text-green-800">Cookie found!</p>
          <p className="mt-2">Value: {authCookie.value}</p>
          <p>Path: {authCookie.path}</p>
          <p>Expires: {authCookie.expires ? new Date(authCookie.expires).toISOString() : "N/A"}</p>
        </div>
      ) : (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="font-medium text-red-800">No auth cookie found</p>
          <p className="mt-2">You are not logged in or the cookie is not being set correctly.</p>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">All Cookies:</h2>
        <pre className="p-4 bg-gray-100 rounded-md overflow-auto text-xs">
          {JSON.stringify(
            cookieStore.getAll().map((c) => ({ name: c.name, value: c.value })),
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  )
}
