const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixRLS() {
  console.log('🔧 Starting RLS fix for profiles_backup table...');
  
  // Create admin client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    // Enable RLS on profiles_backup table
    console.log('📋 Enabling RLS on profiles_backup table...');
    const { error: rlsError } = await supabase.rpc('sql', {
      query: 'ALTER TABLE public.profiles_backup ENABLE ROW LEVEL SECURITY;'
    });
    
    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
      return;
    }
    
    console.log('✅ RLS enabled successfully');

    // Create SELECT policy
    console.log('📋 Creating SELECT policy...');
    const { error: selectPolicyError } = await supabase.rpc('sql', {
      query: `
        CREATE POLICY "Users can view own backup profile" ON public.profiles_backup
        FOR SELECT USING (auth.uid() = id);
      `
    });
    
    if (selectPolicyError) {
      console.error('❌ Error creating SELECT policy:', selectPolicyError);
    } else {
      console.log('✅ SELECT policy created successfully');
    }

    // Create UPDATE policy
    console.log('📋 Creating UPDATE policy...');
    const { error: updatePolicyError } = await supabase.rpc('sql', {
      query: `
        CREATE POLICY "Users can update own backup profile" ON public.profiles_backup
        FOR UPDATE USING (auth.uid() = id);
      `
    });
    
    if (updatePolicyError) {
      console.error('❌ Error creating UPDATE policy:', updatePolicyError);
    } else {
      console.log('✅ UPDATE policy created successfully');
    }

    // Verify RLS is enabled
    console.log('📋 Verifying RLS status...');
    const { data: rlsStatus, error: statusError } = await supabase.rpc('sql', {
      query: `
        SELECT tablename, rowsecurity 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles_backup';
      `
    });
    
    if (statusError) {
      console.error('❌ Error checking RLS status:', statusError);
    } else {
      console.log('✅ RLS Status:', rlsStatus);
    }

    console.log('🎉 RLS fix completed successfully!');
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

// Run the fix
fixRLS();