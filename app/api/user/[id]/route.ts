import { NextResponse } from "next/server"
import { getUserProfileAction } from "@/app/actions/user-actions"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Try to get user from V2 Supabase database
    try {
      const userProfile = await getUserProfileAction(userId)
      
      if (userProfile) {
        // Map Supabase profile to expected format
        const user = {
          id: userProfile.user_id,
          email: userProfile.email,
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          role: userProfile.role,
          company_name: userProfile.company_name,
        }
        
        return NextResponse.json({ user })
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
    }

    // Fallback user if not found or error
    const fallbackUser = {
      id: userId,
      email: "demo@curveai.com",
      first_name: "Demo",
      last_name: "User",
      role: userId === "1" ? "admin" : "client",
      company_name: "Curve AI Demo",
    }

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
