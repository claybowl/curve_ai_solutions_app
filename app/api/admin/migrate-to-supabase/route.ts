import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { runMigration } from '@/lib/supabase-migration'
import { isUserAdmin } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Create Supabase client
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Check if user is admin
    const isAdmin = await isUserAdmin()
    
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }
    
    // Get default password from request or use default
    const { defaultPassword } = await req.json()
    const password = defaultPassword || 'ChangeMe123!'
    
    // Run migration
    const result = await runMigration(password)
    
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error in migration API:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}