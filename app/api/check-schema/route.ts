import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic response to test if the API route works
    return NextResponse.json({
      status: "API route is working",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("API route error:", error)

    // Return a detailed error response
    return NextResponse.json(
      {
        error: "API route error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
