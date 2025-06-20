import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated",
      message: "Admin password reset is now handled through Supabase authentication. Use the admin dashboard or create a new admin user instead.",
      redirectTo: "/admin/create-admin"
    },
    { status: 410 }
  )
}
