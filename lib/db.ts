// Create a lazy-loaded SQL client for backward compatibility
// This avoids initializing Neon at module load time
let cachedSql: any = null;

async function initSql() {
  if (!cachedSql) {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not set, database operations will not work")
      return null
    }
    try {
      const { neon } = await import("@neondatabase/serverless")
      cachedSql = neon(process.env.DATABASE_URL)
    } catch (error) {
      console.error("Failed to initialize Neon SQL client:", error)
      return null
    }
  }
  return cachedSql
}

// Create a wrapper object that initializes sql lazily
class SqlWrapper {
  async query(sql: string, params?: any[]) {
    const sqlClient = await initSql()
    if (!sqlClient) {
      console.warn("Database not available, returning empty result")
      return []
    }
    return sqlClient.query(sql, params)
  }

  async execute(strings: TemplateStringsArray, ...values: any[]) {
    const sqlClient = await initSql()
    if (!sqlClient) {
      console.warn("Database not available, returning empty result")
      return []
    }
    // Template literal execution
    return (sqlClient as any)`${strings}`(...values)
  }

  // Support template literal syntax: sql`...`
  async [Symbol.templateLiteral](strings: TemplateStringsArray, ...values: any[]) {
    return this.execute(strings, ...values)
  }
}

// Create singleton instance and export it as 'sql'
export const sql = {
  query: async (sqlStr: string, params?: any[]) => {
    const sqlClient = await initSql()
    if (!sqlClient) {
      console.warn("Database not available for query:", sqlStr)
      return []
    }
    return sqlClient.query(sqlStr, params)
  },
  async: true
} as any

// Helper function for raw SQL queries with timeout and error handling
export async function executeQuery(query: string, params: any[] = [], timeoutMs = 5000) {
  try {
    // Dynamically import neon only when needed
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not set, skipping database query")
      return null
    }

    const { neon } = await import("@neondatabase/serverless")
    const sqlClient = neon(process.env.DATABASE_URL)

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database query timeout")), timeoutMs),
    )

    if (params.length === 0) {
      // Use tagged template literal for simple queries with timeout
      const queryPromise = sqlClient`${query}`
      return await Promise.race([queryPromise, timeoutPromise])
    } else {
      // Use sql.query for parameterized queries with timeout
      const queryPromise = sqlClient.query(query, params)
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
    if (!process.env.DATABASE_URL) {
      return { connected: false, message: "DATABASE_URL not configured" }
    }

    const { neon } = await import("@neondatabase/serverless")
    const sqlClient = neon(process.env.DATABASE_URL)
    const result = await sqlClient`SELECT 1 as connection_test`
    return { connected: true, result }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return { connected: false, error }
  }
}

// Get the raw SQL client (for direct access if needed)
export async function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  return await initSql()
}
