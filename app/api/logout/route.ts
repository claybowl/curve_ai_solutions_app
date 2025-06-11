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
    const response = new NextResponse()
    const supabase = createRouteHandlerClient(request, response)
    
    // Sign out from Supabase
    await supabase.auth.signOut()
    
    // Clear legacy cookies for backward compatibility
    const cookieStore = await cookies()
    cookieStore.delete("admin-auth")
    cookieStore.delete("simple-admin-auth")

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Successfully logged out",
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({
      success: false,
      message: "Error during logout",
    }, { status: 500 })
  }
}