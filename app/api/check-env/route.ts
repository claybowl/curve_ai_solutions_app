import { NextResponse } from 'next/server'

export async function GET() {
  // Check environment variables
  const envStatus = {
    NOTION_TOKEN: !!process.env.NOTION_TOKEN,
    NOTION_BLOG_DATABASE_ID: !!process.env.NOTION_BLOG_DATABASE_ID,
    // Don't expose the actual values for security reasons
    tokenLength: process.env.NOTION_TOKEN ? process.env.NOTION_TOKEN.length : 0,
    databaseIdLength: process.env.NOTION_BLOG_DATABASE_ID ? process.env.NOTION_BLOG_DATABASE_ID.length : 0,
  }

  return NextResponse.json({
    status: 'success',
    environment: process.env.NODE_ENV,
    envStatus,
  })
} 