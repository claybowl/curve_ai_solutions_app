import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  // Clear all auth cookies
  const cookieStore = cookies()
  await cookieStore.delete("next-auth.session-token")
  await cookieStore.delete("admin-auth")
  await cookieStore.delete("simple-admin-auth")

  // Return success response
  return NextResponse.json({
    success: true,
    message: "Successfully logged out",
  })
}
