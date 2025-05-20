import { NextResponse } from "next/server"

// This route replaces the default NextAuth session endpoint
// to avoid conflicts with Supabase auth

export async function GET() {
  return NextResponse.json({ 
    message: "Auth system migrated to Supabase. This endpoint is maintained for backward compatibility.",
    user: null,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  })
}