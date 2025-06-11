// Temporarily disable ALL middleware to test auth flow
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Let everything through - no auth checks
  return NextResponse.next()
}

export const config = {
  matcher: []  // Empty matcher - middleware won't run on any routes
}