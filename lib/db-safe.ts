// A safe version of the database utility that won't throw errors in preview environments

export async function safeQuery(queryFn: () => Promise<any>, fallback: any) {
  // In preview mode or when DATABASE_URL is not available, always use fallback
  if (!process.env.DATABASE_URL || process.env.VERCEL_ENV === "preview") {
    console.log("Using fallback data (preview mode or no DATABASE_URL)")
    return fallback
  }

  try {
    // Add a timeout to the database query
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database query timeout")), 3000),
    )

    // Race the database query against the timeout
    const result = await Promise.race([queryFn(), timeoutPromise])
    return result
  } catch (error) {
    console.error("Safe database query error:", error)
    return fallback
  }
}

// Function to test database connection safely
export async function testConnectionSafe() {
  if (!process.env.DATABASE_URL || process.env.VERCEL_ENV === "preview") {
    return { connected: false, message: "Preview mode or no DATABASE_URL" }
  }

  try {
    // Import neon only if we're going to use it
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL)

    const result = await sql`SELECT 1 as connection_test`
    return { connected: true, result }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return { connected: false, error }
  }
}
