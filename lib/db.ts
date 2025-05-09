import { neon } from "@neondatabase/serverless"

// Create a SQL client with the Neon serverless driver with better error handling
export const sql = neon(process.env.DATABASE_URL!)

// Helper function for raw SQL queries with timeout and error handling
export async function executeQuery(query: string, params: any[] = [], timeoutMs = 5000) {
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database query timeout")), timeoutMs),
    )

    if (params.length === 0) {
      // Use tagged template literal for simple queries with timeout
      const queryPromise = sql`${query}`
      return await Promise.race([queryPromise, timeoutPromise])
    } else {
      // Use sql.query for parameterized queries with timeout
      const queryPromise = sql.query(query, params)
      return await Promise.race([queryPromise, timeoutPromise])
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw error // Re-throw to allow caller to handle
  }
}

// Function to test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as connection_test`
    return { connected: true, result }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return { connected: false, error }
  }
}
