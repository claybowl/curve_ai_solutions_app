import { NextResponse } from "next/server"
import { cookies } from "next/headers"

/**
 * API route for manual logout
 * Note: This route is meant as a fallback for client-side NextAuth.js signOut()
 * In most cases, you should use the signOut() function from next-auth/react directly
 */
export async function POST() {
  // Clear all auth cookies
  const cookieStore = cookies()
  
  // Clear NextAuth.js cookie
  cookieStore.delete("next-auth.session-token")
  
  // Clear legacy cookies for backward compatibility
  cookieStore.delete("admin-auth")
  cookieStore.delete("simple-admin-auth")

  // Return success response
  return NextResponse.json({
    success: true,
    message: "Successfully logged out",
  })
}