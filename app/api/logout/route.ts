import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"

/**
 * API route for manual logout
 * Note: This route is meant as a fallback for client-side Supabase signOut()
 * In most cases, you should use the signOut() function from Supabase client directly
 */
export async function POST(request: Request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out",
    })
    const supabase = await createRouteHandlerClient(request, response)

    await supabase.auth.signOut()

    // Clean up legacy cookies if available
    try {
      const cookieStore = await cookies()
      if (cookieStore) {
        cookieStore.delete("admin-auth")
        cookieStore.delete("simple-admin-auth")
      }
    } catch (error) {
      // Cookies might not be available in certain contexts
      console.warn("Failed to clean up cookies:", error)
    }

    // Delete via response headers as well
    try {
      response.cookies.delete("admin-auth")
      response.cookies.delete("simple-admin-auth")
    } catch (error) {
      // Silently fail if response cookies not available
    }

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({
      success: false,
      message: "Error during logout",
    }, { status: 500 })
  }
}
