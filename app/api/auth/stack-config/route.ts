import { NextResponse } from "next/server"

export async function GET() {
  // Only return the public project ID, not the sensitive key
  return NextResponse.json({
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
  })
}
