import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function GET(req: NextRequest) {
  try {
    // Create admin client
    const supabase = createSupabaseAdmin()

    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      checks: {}
    }

    // 1. Check if profiles table exists
    try {
      const { data: profilesCheck, error: profilesError } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1)
      
      diagnostics.checks.profilesTable = {
        exists: !profilesError,
        error: profilesError?.message,
        hasData: profilesCheck ? profilesCheck.length > 0 : false
      }
    } catch (err) {
      diagnostics.checks.profilesTable = {
        exists: false,
        error: (err as Error).message
      }
    }

    // 2. Check table structure
    try {
      const { data: columns, error: columnsError } = await supabase.rpc('get_table_columns', {
        table_name: 'profiles'
      })
      
      diagnostics.checks.tableStructure = {
        success: !columnsError,
        columns: columns || [],
        error: columnsError?.message
      }
    } catch (err) {
      // Fallback: try to query the table directly to see structure
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
        
        diagnostics.checks.tableStructure = {
          success: !error,
          canQuery: !error,
          error: error?.message
        }
      } catch (fallbackErr) {
        diagnostics.checks.tableStructure = {
          success: false,
          error: (fallbackErr as Error).message
        }
      }
    }

    // 3. Check RLS policies
    try {
      const { data: policies, error: policiesError } = await supabase.rpc('get_table_policies', {
        table_name: 'profiles'
      })
      
      diagnostics.checks.rlsPolicies = {
        success: !policiesError,
        policies: policies || [],
        error: policiesError?.message
      }
    } catch (err) {
      diagnostics.checks.rlsPolicies = {
        success: false,
        error: (err as Error).message
      }
    }

    // 4. Check triggers and functions
    try {
      const { data: triggers, error: triggersError } = await supabase.rpc('get_table_triggers', {
        table_name: 'profiles'
      })
      
      diagnostics.checks.triggers = {
        success: !triggersError,
        triggers: triggers || [],
        error: triggersError?.message
      }
    } catch (err) {
      diagnostics.checks.triggers = {
        success: false,
        error: (err as Error).message
      }
    }

    // 5. Test user creation (dry run)
    try {
      // Don't actually create, just test if we can access the auth admin functions
      const { data: usersList, error: usersError } = await supabase.auth.admin.listUsers({
        page: 1,
        perPage: 1
      })
      
      diagnostics.checks.authAdmin = {
        success: !usersError,
        canListUsers: !usersError,
        userCount: usersList?.users?.length || 0,
        error: usersError?.message
      }
    } catch (err) {
      diagnostics.checks.authAdmin = {
        success: false,
        error: (err as Error).message
      }
    }

    // 6. Check if handle_new_user function exists
    try {
      const { data: functionCheck, error: functionError } = await supabase.rpc('handle_new_user_test')
      
      diagnostics.checks.handleNewUserFunction = {
        exists: !functionError,
        error: functionError?.message
      }
    } catch (err) {
      diagnostics.checks.handleNewUserFunction = {
        exists: false,
        error: (err as Error).message,
        note: "Function may not have test wrapper - this is expected"
      }
    }

    return NextResponse.json({
      success: true,
      diagnostics
    })

  } catch (error) {
    console.error('Error in database diagnostics:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json()
    
    const supabase = createSupabaseAdmin()

    if (action === 'recreate_profiles_table') {
      // Read the SQL schema file and execute it
      const fs = require('fs')
      const path = require('path')
      const schemaPath = path.join(process.cwd(), 'supabase-profiles-schema.sql')
      
      try {
        const schema = fs.readFileSync(schemaPath, 'utf8')
        
        // Execute the schema
        const { data, error } = await supabase.rpc('exec_sql', { sql: schema })
        
        return NextResponse.json({
          success: !error,
          message: error ? `Error executing schema: ${error.message}` : 'Schema recreated successfully',
          error: error?.message
        })
      } catch (fileErr) {
        return NextResponse.json({
          success: false,
          error: `Could not read schema file: ${(fileErr as Error).message}`
        })
      }
    }

    if (action === 'test_user_creation') {
      // Test creating a user
      const testEmail = `test-${Date.now()}@example.com`
      
      const { data, error } = await supabase.auth.admin.createUser({
        email: testEmail,
        password: 'TestPassword123!',
        email_confirm: true,
        user_metadata: {
          firstName: 'Test',
          lastName: 'User',
          role: 'client'
        }
      })
      
      if (error) {
        return NextResponse.json({
          success: false,
          error: `User creation failed: ${error.message}`,
          details: error
        })
      }
      
      // If successful, clean up the test user
      if (data.user) {
        await supabase.auth.admin.deleteUser(data.user.id)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Test user creation successful (user was deleted after test)',
        userId: data.user?.id
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 })

  } catch (error) {
    console.error('Error in database action:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}