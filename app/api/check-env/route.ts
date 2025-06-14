import { NextResponse } from 'next/server'

export async function GET() {
  // Check environment variables
  const envStatus = {
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    DATABASE_URL: !!process.env.DATABASE_URL,
  }

  return NextResponse.json({
    status: 'success',
    environment: process.env.NODE_ENV,
    envStatus,
  })
} 