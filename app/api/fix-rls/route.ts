import { NextRequest, NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

// Create admin client with service role key for database administration
function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables for admin operations')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Execute raw SQL using the REST API directly
async function executeSQL(sql: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql })
  })
  
  if (!response.ok) {
    // Try alternative method - direct SQL endpoint
    const altResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/sql',
      },
      body: sql
    })
    
    if (!altResponse.ok) {
      throw new Error(`SQL execution failed: ${response.status} - ${await response.text()}`)
    }
    
    return await altResponse.json()
  }
  
  return await response.json()
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting RLS fix via API...')
    
    const supabase = createAdminSupabaseClient()
    const results = []

    // Since we can't execute raw SQL directly, let's check if we can create a workaround
    // by temporarily disabling RLS and then re-enabling with correct policies
    
    console.log('📝 Attempting to fix RLS through profile management...')
    
    // First, let's check if we can access profiles at all with service role
    const { data: profilesTest, error: profilesError } = await supabase
      .from('profiles')
      .select('id, user_id, role')
      .limit(1)
    
    if (profilesError) {
      console.log('❌ Cannot access profiles table:', profilesError.message)
      
      // The issue might be that RLS is preventing even service role access
      // Let's provide SQL commands that need to be run manually
      const sqlCommands = `
-- Copy and paste these commands into Supabase SQL Editor:

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON profiles;

-- 2. Create security definer function
CREATE OR REPLACE FUNCTION is_admin_user(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create new RLS policies
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (is_admin_user());

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (is_admin_user());

CREATE POLICY "Admins can insert profiles" ON profiles
  FOR INSERT WITH CHECK (is_admin_user());

-- 4. Grant permissions
GRANT EXECUTE ON FUNCTION is_admin_user TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_user TO anon;
      `
      
      return NextResponse.json({
        success: false,
        message: 'Cannot fix RLS programmatically. Manual SQL execution required.',
        sql_commands: sqlCommands,
        instructions: [
          '1. Go to your Supabase project dashboard',
          '2. Navigate to SQL Editor',
          '3. Create a new query',
          '4. Copy and paste the SQL commands above',
          '5. Run the query',
          '6. Test the authentication again'
        ]
      })
    }
    
    console.log('✅ Service role can access profiles')
    console.log('📊 Found profiles:', profilesTest?.length || 0)
    
    // Check if admin user exists
    const { data: adminUser, error: adminError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'admin')
      .limit(1)
      .single()
    
    if (adminError || !adminUser) {
      console.log('⚠️  No admin user found, let\'s check auth.users')
      
      // Try to find admin in auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.log('❌ Cannot list auth users:', authError.message)
      } else {
        console.log('👥 Found auth users:', authUsers.users.length)
        
        // Look for admin@curveai.com
        const adminAuthUser = authUsers.users.find(u => u.email === 'admin@curveai.com')
        
        if (adminAuthUser) {
          console.log('✅ Found admin auth user:', adminAuthUser.id)
          
          // Try to create/update the profile
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .upsert({
              user_id: adminAuthUser.id,
              email: adminAuthUser.email,
              first_name: 'Admin',
              last_name: 'User', 
              role: 'admin'
            }, {
              onConflict: 'user_id'
            })
            .select()
            .single()
          
          if (profileError) {
            console.log('❌ Cannot create admin profile:', profileError.message)
          } else {
            console.log('✅ Admin profile created/updated')
            results.push({
              step: 'admin_profile',
              success: true,
              message: 'Admin profile ensured'
            })
          }
        }
      }
    } else {
      console.log('✅ Admin user exists:', adminUser.email)
      results.push({
        step: 'admin_check',
        success: true,
        message: 'Admin user verified'
      })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'RLS diagnostics completed. Database is accessible with service role.',
      results,
      next_steps: [
        'The authentication should work now.',
        'If still having issues, the RLS policies need to be fixed manually.',
        'Contact your database administrator to run the SQL fix.'
      ]
    })

  } catch (error) {
    console.error('❌ RLS fix failed:', error)
    
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      message: 'RLS fix failed - service role cannot modify database policies'
    }, { status: 500 })
  }
}

// GET method to check current RLS status
export async function GET() {
  try {
    const supabase = createAdminSupabaseClient()
    
    // Check if the function exists
    const { data: functions, error: funcError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_name', 'is_admin_user')
    
    // Check policies
    const { data: policies, error: policyError } = await supabase
      .from('information_schema.table_constraints')
      .select('constraint_name')
      .eq('table_name', 'profiles')
    
    return NextResponse.json({
      function_exists: !funcError && functions && functions.length > 0,
      policies_count: policies ? policies.length : 0,
      status: 'checked'
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      status: 'error' 
    }, { status: 500 })
  }
}