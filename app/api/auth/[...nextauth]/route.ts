import { NextResponse } from "next/server"

// This route is now deprecated as we've switched to Supabase Auth
// Keeping the route to avoid breaking existing code during transition
export async function GET(request: Request) {
  return NextResponse.json({ 
    error: "This authentication endpoint is deprecated. The application now uses Supabase Auth." 
  })
}

export async function POST(request: Request) {
  return NextResponse.json({ 
    error: "This authentication endpoint is deprecated. The application now uses Supabase Auth." 
  })
}
