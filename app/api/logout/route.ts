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

    const cookieStore = await cookies()
    cookieStore.delete("admin-auth")
    cookieStore.delete("simple-admin-auth")
    response.cookies.delete("admin-auth")
    response.cookies.delete("simple-admin-auth")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({
      success: false,
      message: "Error during logout",
    }, { status: 500 })
  }
}
