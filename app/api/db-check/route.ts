import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    // Actually test the database connection
    const connectionTest = await testConnection()

    if (connectionTest.connected) {
      return NextResponse.json({
        status: "ok",
        message: "Database connection successful",
        details: connectionTest.result,
      })
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "Database connection failed",
          error: connectionTest.error instanceof Error ? connectionTest.error.message : String(connectionTest.error),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection check failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
import { NextResponse } from 'next/server';
import { testConnection } from '../../../lib/db';

export async function GET() {
  try {
    const connectionStatus = await testConnection();
    return NextResponse.json(connectionStatus);
  } catch (error) {
    return NextResponse.json({ connected: false, error: error.message });
  }
}
