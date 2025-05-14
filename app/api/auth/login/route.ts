import { NextResponse } from "next/server"

/**
 * DEPRECATED: This custom login API is no longer used.
 * The application now uses NextAuth exclusively for authentication.
 * Please use the standard NextAuth endpoints instead.
 */
export async function POST() {
  return NextResponse.json({
    success: false,
    error: "This login endpoint is deprecated. The app now uses NextAuth for authentication.",
    message: "Please use the standard login page at /login which integrates with NextAuth."
  }, { status: 400 })
}
