import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  try {
    console.log('🔧 Starting RLS fix for profiles_backup table...');
    
    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // First check if table exists and current RLS status
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles_backup');

    if (tableError) {
      console.error('❌ Error checking table:', tableError);
      return Response.json({ error: 'Failed to check table' }, { status: 500 });
    }

    if (!tableInfo || tableInfo.length === 0) {
      return Response.json({ message: 'profiles_backup table does not exist' }, { status: 404 });
    }

    console.log('✅ Table exists, proceeding with RLS fix...');

    // Note: Direct SQL execution requires SQL editor or migration
    // This endpoint will provide the SQL commands needed
    const sqlCommands = [
      'ALTER TABLE public.profiles_backup ENABLE ROW LEVEL SECURITY;',
      `CREATE POLICY "Users can view own backup profile" ON public.profiles_backup
       FOR SELECT USING (auth.uid() = id);`,
      `CREATE POLICY "Users can update own backup profile" ON public.profiles_backup
       FOR UPDATE USING (auth.uid() = id);`
    ];

    return Response.json({
      message: 'RLS fix SQL commands generated',
      instructions: 'Run these commands in your Supabase SQL editor:',
      sqlCommands,
      note: 'These commands will enable RLS and create appropriate policies for the profiles_backup table'
    });

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}