import { NextRequest, NextResponse } from 'next/server'

/**
 * DEPRECATED: This project uses Stack Auth, not Supabase.
 * This route is no longer functional.
 * 
 * Use Stack Auth admin APIs instead:
 * - Stack Auth Dashboard: https://app.stack-auth.com
 * - Stack Auth Admin API: See @stackframe/js documentation
 */

export async function POST(req: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'This endpoint is deprecated. This project uses Stack Auth, not Supabase. ' +
           'Please use Stack Auth admin APIs for user management.'
  }, { status: 410 }) // 410 Gone
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    success: false,
    error: 'This endpoint is deprecated. This project uses Stack Auth, not Supabase. ' +
           'Please use Stack Auth admin APIs for user management.'
  }, { status: 410 }) // 410 Gone
}
