import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear all auth cookies
  cookies().delete("next-auth.session-token")
  cookies().delete("admin-auth")
  cookies().delete("simple-admin-auth")

  // Return success response
  return NextResponse.json({
    success: true,
    message: "Successfully logged out",
  })
}
