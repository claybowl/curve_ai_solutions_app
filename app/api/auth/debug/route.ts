import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    return NextResponse.json({
      authenticated: !!session,
      session,
      env: {
        nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
        hasSecret: !!process.env.NEXTAUTH_SECRET,
      },
    })
  } catch (error) {
    console.error("Auth debug error:", error)
    return NextResponse.json(
      { error: "Failed to get session", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
