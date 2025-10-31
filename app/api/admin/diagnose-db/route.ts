import { NextRequest, NextResponse } from 'next/server'

/**
 * DEPRECATED: This project uses Stack Auth for authentication and Neon PostgreSQL for database.
 * This route is no longer functional.
 * 
 * For database diagnostics, use:
 * - Neon Dashboard: https://console.neon.tech
 * - Database connection: Check DATABASE_URL environment variable
 * - Stack Auth: https://app.stack-auth.com
 */

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'This endpoint is deprecated. This project uses Stack Auth for authentication ' +
           'and Neon PostgreSQL for database, not Supabase. ' +
           'Please use Neon Dashboard or Stack Auth Dashboard for diagnostics.'
  }, { status: 410 }) // 410 Gone
}

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'This endpoint is deprecated. This project uses Stack Auth for authentication ' +
           'and Neon PostgreSQL for database, not Supabase. ' +
           'Please use Neon Dashboard or Stack Auth Dashboard for diagnostics.'
  }, { status: 410 }) // 410 Gone
}
