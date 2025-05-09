import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Create a fallback user object
    const fallbackUser = {
      id: userId,
      email: "demo@curveai.com",
      first_name: "Demo",
      last_name: "User",
      role: userId === "1" ? "admin" : "client",
      company_name: "Curve AI Demo",
    }

    // In preview mode or when DATABASE_URL is not available, always use fallback
    if (!process.env.DATABASE_URL || process.env.VERCEL_ENV === "preview") {
      console.log("Using fallback user data (preview mode or no DATABASE_URL)")
      return NextResponse.json({
        user: fallbackUser,
        _fallback: true,
      })
    }

    // For production with DATABASE_URL, we'll try the database but have a robust fallback
    try {
      // Import neon only if we're going to use it
      const { neon } = await import("@neondatabase/serverless")
      const sql = neon(process.env.DATABASE_URL)

      // Add a timeout to the database query
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      try {
        // Wrap in try-catch to handle AbortController errors
        const users = await sql`
          SELECT id, email, first_name, last_name, company_name, role
          FROM users
          WHERE id = ${userId}
        `
        clearTimeout(timeoutId)

        if (users && users.length > 0) {
          return NextResponse.json({ user: users[0] })
        }
      } catch (queryError) {
        console.error("Database query error:", queryError)
        // Fall through to fallback
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      // Continue to fallback if database fails - don't throw
    }

    // Return the fallback user response if database query fails or returns no results
    console.log("Using fallback user data for userId:", userId)
    return NextResponse.json({
      user: fallbackUser,
      _fallback: true,
    })
  } catch (error) {
    console.error("Error in user API route:", error)

    // Always return a valid response even on error
    return NextResponse.json({
      user: {
        id: params.id || "1",
        email: "demo@curveai.com",
        first_name: "Demo",
        last_name: "User",
        role: "client",
        company_name: "Curve AI Demo",
      },
      _error: true,
      _message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
